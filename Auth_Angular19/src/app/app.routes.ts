import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { authGuard } from './shared/guard/auth.guard';
import { PropertyUserComponent } from './pages/property-user/property-user.component';
import { PropertyRolComponent } from './pages/property-rol/property-rol.component';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { authRolGuard } from './shared/guard/auth-rol.guard';
import { EditarRolComponent } from './pages/editar-rol/editar-rol.component';
import { InsertarRolComponent } from './pages/insertar-rol/insertar-rol.component';
import { adminRoleGuard } from './shared/guard/admin-role.guard';

export const routes: Routes = [
    {path:'', redirectTo:'/signin', pathMatch:'full'},
    {path:'', component: UserComponent,
        children:[
            {path:'signup', component:RegistrationComponent},
            {path:'signin', component:LoginComponent}
        ]
    },
    {path:'nav',// ruta protegida  que tiene el navbar
        component:NavbarComponent,
        canActivate: [authGuard], // aplicamos el guard
        children:[
            {path:'detalle-user', component: PropertyUserComponent},
            {path:'detalle-rol', component:PropertyRolComponent},
            { path: 'usuario/editar/:id', component: EditarUsuarioComponent,  canActivate: [authRolGuard] }, 
            { path: 'insertar_rol', component:InsertarRolComponent,canActivate: [adminRoleGuard]}, 
            { path: 'rol/editar/:id', component: EditarRolComponent,canActivate: [adminRoleGuard]},
            { path: '', redirectTo: 'detalle-user', pathMatch: 'full' } // Ruta predeterminada en nav
        ],
    },
    { path: '**', redirectTo: '/signin' } // Redirección para rutas no encontradas

];
