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
            CREATE SEQUENCE IF NOT EXISTS transaction_reference_seq;

            CREATE TABLE public.\"MembershipPlan\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                type text NOT NULL,
                rate numeric NOT NULL,
                description text NOT NULL,
                session_rate numeric NOT NULL,
                CONSTRAINT \"MembershipPlan_pkey\" PRIMARY KEY (id)
            );

            CREATE TABLE public.\"Employee\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                username text NOT NULL UNIQUE,
                password text NOT NULL,
                email text NOT NULL UNIQUE,
                contact_number text NOT NULL CHECK (contact_number ~ '^09[0-9]{9}$'),
                hire_date date NOT NULL,
                monthly_salary numeric NOT NULL CHECK (monthly_salary > 0),
                role text NOT NULL CHECK (role = ANY (ARRAY['Manager', 'Employee'])),
                address text,
                CONSTRAINT \"Employee_pkey\" PRIMARY KEY (id)
            );

            CREATE TABLE public.\"MemberList\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                contact_number text NOT NULL CHECK (contact_number ~ '^09[0-9]{9}$'),
                email text NOT NULL UNIQUE,
                address text NOT NULL,
                plan_type bigint NOT NULL,
                CONSTRAINT \"MemberList_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"MemberList_plan_type_fkey\" FOREIGN KEY (plan_type)
                    REFERENCES public.\"MembershipPlan\"(id)
            );

            CREATE TABLE public.\"Customer\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                name text NOT NULL,
                created_at timestamp without time zone NOT NULL,
                member_id bigint,
                CONSTRAINT \"Customer_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"Customer_member_id_fkey\" FOREIGN KEY (member_id)
                    REFERENCES public.\"MemberList\"(id)
            );

            CREATE TABLE public.\"MembershipSubscription\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                date_time_start timestamp without time zone NOT NULL,
                date_time_out timestamp without time zone NOT NULL,
                plan_id bigint NOT NULL,
                member_id bigint NOT NULL,
                CONSTRAINT \"MembershipSubscription_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"MembershipSubscription_plan_id_fkey\" FOREIGN KEY (plan_id)
                    REFERENCES public.\"MembershipPlan\"(id),
                CONSTRAINT \"MembershipSubscription_member_id_fkey\" FOREIGN KEY (member_id)
                    REFERENCES public.\"MemberList\"(id)
            );

            CREATE TABLE public.\"WorkoutSession\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                date_time_in timestamp without time zone NOT NULL,
                customer_id bigint NOT NULL,
                CONSTRAINT \"WorkoutSession_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"WorkoutSession_customer_id_fkey\" FOREIGN KEY (customer_id)
                    REFERENCES public.\"Customer\"(id)
            );

            CREATE TABLE public.\"Transaction\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                date_time timestamp without time zone NOT NULL,
                mode_of_payment text NOT NULL DEFAULT 'Cash'
                    CHECK (lower(mode_of_payment) = ANY (ARRAY['cash', 'gcash'])),
                reference_number text NOT NULL DEFAULT
                    ('TXN-' || lpad((nextval('transaction_reference_seq'))::text, 6, '0')),
                status text NOT NULL DEFAULT 'Paid'
                    CHECK (lower(status) = ANY (ARRAY['paid', 'pending', 'failed'])),
                recorded_by bigint NOT NULL,
                session_id bigint,
                subscription_id bigint,
                paid_amount numeric NOT NULL CHECK (paid_amount >= 0),
                CONSTRAINT \"Transaction_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"Transaction_recorded_by_fkey\" FOREIGN KEY (recorded_by)
                    REFERENCES public.\"Employee\"(id),
                CONSTRAINT \"Transaction_session_id_fkey\" FOREIGN KEY (session_id)
                    REFERENCES public.\"WorkoutSession\"(id),
                CONSTRAINT \"Transaction_subscription_id_fkey\" FOREIGN KEY (subscription_id)
                    REFERENCES public.\"MembershipSubscription\"(id)
            );

            CREATE TABLE public.\"CourtBookings\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                reserve_date_time timestamp without time zone NOT NULL,
                reserve_date_end timestamp without time zone NOT NULL,
                contact_person text NOT NULL,
                contact_number numeric NOT NULL,
                status text NOT NULL
                    CHECK (status = ANY (ARRAY['Pending', 'On Going', 'Finished', 'Cancelled'])),
                CONSTRAINT \"CourtBookings_pkey\" PRIMARY KEY (id)
            );
            
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
    }
};
