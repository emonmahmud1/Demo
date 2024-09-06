<?php

namespace App\Main\Report;

use App\Models\User as ModelsUser;
use Illuminate\Support\Facades\DB;

class User
{
    private static array $forone = [
        'users.id',
        'users.employee_id',
        'users.department_id',
        'users.name',
        'users.email',
        'users.phone_number',
        'users.date_of_birth',
        'users.gender',
        'users.address',
        'users.email_verified_at',

    ];
    private static array $forall = [
        'users.id',
        'users.employee_id',
        'users.department_id',
        'users.name',
        'users.email',

    ];
    private static function generate(array $queries = [], $cols, $deleted = false)
    {
        $user = DB::table('users')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id')
            ->select($cols);

        if (!$deleted) {
            $user->whereNull('users.deleted_at');
        } else {
            $user->whereNotNull('users.deleted_at');
        }
        foreach ($queries as $key => $value) {
            if ($key == 'id') {
                $user->where('users.id', $value);
                continue;
            }
            $user->where('users.' . $key, $value);
        }

        return $user;
    }
    public static function all(array $queries = [], $deleted)
    {
        return self::generate($queries, self::$forall, $deleted)->get([]);
    }

    public static function find(array $queries = [])
    {
        return self::generate($queries, self::$forone)->get()->first();
    }

    public static function count(array $queries = [])
    {
        return self::generate($queries, self::$forall)->count();
    }

    public static function sum(array $queries = [], string $column)
    {
        return self::generate($queries, self::$forall)->sum($column);
    }
    
    public static function checkUser(array $queries=[], $deleted){
        return self::generate($queries, self::$forone, $deleted)->exists();
    }

    public static function getWithRolesPerms($id)
    {
        $user = self::find(['id' => $id]);
        $user->roles_list = DB::table('users')
            ->leftJoin('model_has_roles as m', 'users.id', '=', 'm.model_id')
            ->leftJoin('roles as r', 'r.id', '=', 'm.role_id')
            ->where('users.id', $user->id)->get(['r.id', 'r.name']);

        $user->permissions_list = DB::table('users')
            ->select('p.id', 'p.name')
            ->leftJoin('model_has_roles as mr', 'users.id', '=', 'mr.model_id')
            ->leftJoin('roles as r', 'r.id', '=', 'mr.role_id')
            ->leftJoin('role_has_permissions as rp', 'rp.role_id', '=', 'r.id')
            ->leftJoin('model_has_permissions as mp', function ($join) {
                $join->on('users.id', '=', 'mp.model_id');
            })
            ->leftJoin('permissions as p', function ($join) {
                $join->on('rp.permission_id', '=', 'p.id')
                    ->orOn('mp.permission_id', '=', 'p.id');
            })
            ->where('users.id', $user->id)
            ->get();
            
        return $user;
    }
}
