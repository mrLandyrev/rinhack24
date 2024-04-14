import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
    TUI_SANITIZER,
    TuiAlertModule,
    TuiDialogModule,
    TuiRootModule,
} from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {HttpClientModule} from "@angular/common/http";
import {NavigationComponent} from "./modules/navigation/navigation.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, TuiRootModule, TuiDialogModule, TuiAlertModule, HttpClientModule, NavigationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
})
export class AppComponent {
    title = 'rh-email-sanitizer';
}
