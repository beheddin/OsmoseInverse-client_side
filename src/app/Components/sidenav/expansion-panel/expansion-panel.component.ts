import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgFor, NgIf } from '@angular/common';

import { MaterialModules } from '../../../material.modules';
import { MenuBtnItemsInterface } from '../../../Interfaces/menu-btn-items.interface';

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
  imports: [RouterModule, MatExpansionModule, MaterialModules, NgFor, NgIf],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
})
export class ExpansionPanelComponent {
  @Input() label!: string;
  @Input() subItems: MenuBtnItemsInterface[] = [];

  isPanelOpen: boolean = false;
}
