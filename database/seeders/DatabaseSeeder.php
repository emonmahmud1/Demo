<?php

namespace Database\Seeders;

use App\Main\Permissions;
use App\Main\Roles;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (Permissions::$permissions as $key => $group) {
            $id = DB::table('permission_groups')->insertGetId([
                'name' => $key,
                'created_at' => now(),
            ]);

            foreach ($group as $group => $permission) {
                DB::table('permissions')->insert([
                    'name' => $permission . ' ' . $key,
                    'permission_group_id' => $id,
                    'guard_name' => 'web',
                    'created_at' => now(),
                ]);
            }
        }
        $allPermissions = Permission::all();

        foreach (Roles::$roles as $role) {
            DB::table('roles')->insert([
                'name' => $role,
                'protected'=>true,
                'guard_name' => 'web',
                'created_at' => now(),
            ]);
        }
        $deptId = DB::table('departments')->insertGetId([
            'name' => 'IT department',
            'created_at' => now(),
        ]);

        $other_deptId = DB::table('departments')->insertGetId([
            'name' => 'Some department',
            'created_at' => now(),
        ]);

        $superAdminRole = Role::findByName('Super Admin');
        $superAdminRole->syncPermissions($allPermissions);

        $superAdminUserId = DB::table('users')->insertGetId([
            'department_id' => $other_deptId,
            'employee_id'=>"1",
            'name' => 'oishy',
            'email' => 'oishy@eg.com',
            'password' => Hash::make('admin123'),
            'phone_number' => '01680759924',
            'date_of_birth' => '2000-12-11',
            'gender' => 'female',
            'address' => 'some_address',
            'created_at' => now(),
        ]);


        $superAdminUser = User::find($superAdminUserId);
        if ($superAdminUser) {
            $superAdminUser->assignRole($superAdminRole);
        }

        $agentRole = Role::findByName('Agent');
        $agentRole->syncPermissions([
            'Read call_type',
            'Read call_category',
            'Read call_sub_category',
            'Read product',
            'Read product_model',
            'Read product_model_variant',
            'Read call_type',
            'Create ticket',
            'Update ticket',
            'Read ticket',
            'Read customer_profile'
        ]);

        $agentUserId = DB::table('users')->insertGetId([
            'department_id' => $other_deptId,
            'employee_id'=>"2",
            'name' => 'emon',
            'email' => 'emon@example.com',
            'password' => Hash::make('emon12345'),
            'phone_number' => '01680759924',
            'date_of_birth' => '2000-10-11',
            'gender' => 'female',
            'address' => 'some_address',
            'created_at' => now(),
        ]);
        $agentUser = User::find($agentUserId);
        if ($agentUser) {
            $agentUser->assignRole($agentRole);
        }

        // $officeRole = Role::findByName('Office Employee');
        // $officeRole->syncPermissions([
        //     'Read ticket',
        //     'Remarks ticket',
        //     'Solve ticket',
        //     'Forward ticket'
        // ]);


        // $officeUserId = DB::table('users')->insertGetId([
        //     'department_id' => $deptId,
        //     'employee_id'=>3,
        //     'name' => 'mm',
        //     'email' => 'mm@eg.com',
        //     'password' => Hash::make('mm12345'),
        //     'phone_number' => '01680759924',
        //     'date_of_birth' => '2000-10-11',
        //     'gender' => 'female',
        //     'address' => 'some_address',
        //     'created_at' => now(),
        // ]);
        // $officeUser = User::find($officeUserId);
        // if ($officeUser) {
        //     $officeUser->assignRole($officeRole);
        // }
    }
}
