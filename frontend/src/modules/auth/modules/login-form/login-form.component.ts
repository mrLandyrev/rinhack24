import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {

}
