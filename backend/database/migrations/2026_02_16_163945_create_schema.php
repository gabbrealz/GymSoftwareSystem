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
            CREATE TABLE public.\"MembershipPlan\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                type text NOT NULL,
                rate numeric NOT NULL,
                description text NOT NULL,
                session_rate numeric NOT NULL,
                CONSTRAINT \"MembershipPlan_pkey\" PRIMARY KEY (id)
            );

            CREATE TABLE public.\"MemberList\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                contact_number text NOT NULL CHECK (contact_number ~ '^09[0-9]{9}$'::text),
                email text NOT NULL UNIQUE,
                address text NOT NULL,
                plan_type bigint NOT NULL,
                CONSTRAINT \"MemberList_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"MemberList_plan_type_fkey\" FOREIGN KEY (plan_type) REFERENCES public.\"MembershipPlan\"(id)
            );

            CREATE TABLE public.\"Customer\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                name text NOT NULL,
                created_at timestamp without time zone NOT NULL,
                member_id bigint,
                CONSTRAINT \"Customer_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"Customer_member_id_fkey\" FOREIGN KEY (member_id) REFERENCES public.\"MemberList\"(id)
            );

            CREATE TABLE public.\"MembershipSubscription\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                date_time_start timestamp without time zone NOT NULL,
                date_time_out timestamp without time zone NOT NULL,
                plan_id bigint NOT NULL,
                member_id bigint NOT NULL,
                CONSTRAINT \"MembershipSubscription_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"MembershipSubscription_plan_id_fkey\" FOREIGN KEY (plan_id) REFERENCES public.\"MembershipPlan\"(id),
                CONSTRAINT \"MembershipSubscription_member_id_fkey\" FOREIGN KEY (member_id) REFERENCES public.\"MemberList\"(id)
            );

            CREATE TABLE public.\"Employee\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                username text NOT NULL UNIQUE,
                password text NOT NULL,
                email text NOT NULL UNIQUE,
                contact_number text NOT NULL CHECK (contact_number ~ '^09[0-9]{9}$'::text),
                hire_date date NOT NULL,
                monthly_salary numeric NOT NULL CHECK (monthly_salary > 0::numeric),
                role text NOT NULL CHECK (role = ANY (ARRAY['Manager'::text, 'Employee'::text])),
                address text NOT NULL,
                CONSTRAINT \"Employee_pkey\" PRIMARY KEY (id)
            );

            CREATE TABLE public.\"Inventory\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                name text NOT NULL,
                price numeric NOT NULL,
                sku text NOT NULL,
                stock integer,
                last_stocked date,
                stocked_by bigint,
                CONSTRAINT \"Inventory_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"Inventory_stocked_by_fkey\" FOREIGN KEY (stocked_by) REFERENCES public.\"Employee\"(id)
            );

            CREATE TABLE public.\"Transaction\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                date_time timestamp without time zone NOT NULL,
                mode_of_payment text NOT NULL DEFAULT 'Cash'::text,
                reference_number text NOT NULL,
                status text NOT NULL,
                recorded_by bigint,
                CONSTRAINT \"Transaction_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"Transaction_recorded_by_fkey\" FOREIGN KEY (recorded_by) REFERENCES public.\"Employee\"(id)
            );

            CREATE TABLE public.\"WorkoutSession\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                date_time_in timestamp without time zone NOT NULL,
                customer_id bigint NOT NULL,
                CONSTRAINT \"WorkoutSession_pkey\" PRIMARY KEY (id),
                CONSTRAINT \"WorkoutSession_customer_id_fkey\" FOREIGN KEY (customer_id) REFERENCES public.\"Customer\"(id)
            );

            CREATE TABLE public.\"CourtBookings\" (
                id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
                reserve_date_time timestamp without time zone NOT NULL,
                reserve_date_end timestamp without time zone NOT NULL,
                contact_person text NOT NULL,
                contact_number numeric NOT NULL,
                status text NOT NULL CHECK (status = ANY (ARRAY['Pending'::text, 'On Going'::text, 'Finished'::text, 'Cancelled'::text])),
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
