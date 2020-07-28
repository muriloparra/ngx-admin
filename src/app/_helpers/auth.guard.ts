import { ToastrComponent } from './../pages/modal-overlays/toastr/toastr.component';
import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import { RoleService } from '@app/_services';
import { NbToastrConfig } from '@nebular/theme/components/toastr/toastr-config';
import { NbToastComponent, NbToastrService, NbGlobalPositionStrategy, NbGlobalPhysicalPosition } from '@nebular/theme';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: NbAuthService,
        private role: RoleService,
        private toaster: NbToastrService,
    ){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        return this.authService.isAuthenticated()
            .pipe(
                tap(authenticated => {
                    debugger;
                    if(!authenticated){
                        this.router.navigate(['/auth/login']);
                    }
                    
                    var role = ['guest'];

                    this.role.getRole()
                        .subscribe(x => {
                            if(route.data.roles && !x.includes(route.data.roles)){                            
                                this.toaster.show('Você não tem permissão de acesso a essa tela!',
                                    'ERRO', { position: NbGlobalPhysicalPosition.TOP_RIGHT , status: 'danger' });
                                this.router.navigate(['/']);
                            }
                        });
                }),
            );
        // debugger;
        // const currentUser = this.authenticationService.currentUserValue;
        // if(currentUser){
        //     //Checa se a rota é restrita pelo perfil do usuário
        //     if(route.data.roles && route.data.roles.indexOf(currentUser.role)===-1){
        //         this.router.navigate(['/']);
        //         return false;
        //     }
        //     //autorizado então retorna verdadeiro
        //     return true;
        // }
        // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        // return false;
    }
}