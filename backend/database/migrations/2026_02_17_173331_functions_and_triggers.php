<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("
            CREATE OR REPLACE FUNCTION check_created_at_order()
            RETURNS TRIGGER AS $$
            DECLARE
                last_created_at TIMESTAMP;
            BEGIN
                SELECT MAX(created_at)
                INTO last_created_at
                FROM \"Customer\";

                IF last_created_at IS NOT NULL THEN
                    IF NEW.created_at < last_created_at THEN
                        RAISE EXCEPTION 'created_at cannot be earlier than the previous timestamp (%).',
                        last_created_at;
                    END IF;
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_check_created_at
            BEFORE INSERT ON \"Customer\"
            FOR EACH ROW
            EXECUTE FUNCTION check_created_at_order();


            CREATE OR REPLACE FUNCTION auto_create_membership_subscription()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO \"MembershipSubscription\" (
                    member_id,
                    plan_id,
                    date_time_start,
                    date_time_out
                )
                VALUES (
                    NEW.id,
                    NEW.plan_type,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP + INTERVAL '1 month'
                );

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_new_member_subscription
            AFTER INSERT ON \"MemberList\"
            FOR EACH ROW
            EXECUTE FUNCTION auto_create_membership_subscription();

            CREATE TRIGGER trigger_update_member_subscription
            AFTER UPDATE OF plan_type ON \"MemberList\"
            FOR EACH ROW
            WHEN (OLD.plan_type IS DISTINCT FROM NEW.plan_type)
            EXECUTE FUNCTION auto_create_membership_subscription();


            CREATE OR REPLACE FUNCTION validate_transaction_datetime()
            RETURNS TRIGGER AS $$
            DECLARE
                expected_time TIMESTAMP;
            BEGIN
                IF NEW.session_id IS NOT NULL THEN
                    SELECT date_time_in
                    INTO expected_time
                    FROM \"WorkoutSession\"
                    WHERE session_id = NEW.session_id;

                ELSE
                    SELECT date_time_start
                    INTO expected_time
                    FROM \"MembershipSubscription\"
                    WHERE subscription_id = NEW.subscription_id;
                END IF;

                IF NEW.date_time IS DISTINCT FROM expected_time THEN
                    RAISE EXCEPTION 'Transaction date_time must match related session/subscription time';
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_validate_transaction_datetime
            BEFORE INSERT OR UPDATE ON \"Transaction\"
            FOR EACH ROW
            EXECUTE FUNCTION validate_transaction_datetime();

            CREATE OR REPLACE FUNCTION create_workout_session_on_customer_insert()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO public.\"WorkoutSession\" (
                    customer_id,
                    date_time_in
                )
                VALUES (
                    NEW.id,
                    NEW.created_at
                );

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_create_workout_session
            AFTER INSERT ON public.\"Customer\"
            FOR EACH ROW
            EXECUTE FUNCTION create_workout_session_on_customer_insert();

        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
