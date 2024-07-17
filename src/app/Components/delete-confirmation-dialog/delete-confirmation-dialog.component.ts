import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

import { MaterialModules } from '../../material.modules';
import { CompteInterface } from '../../Interfaces/compte.interface';
import { FilialeInterface } from '../../Interfaces/filiale.interface';
import { AtelierInterface } from '../../Interfaces/atelier.interface';
import { StationInterface } from '../../Interfaces/station.interface';
import { BassinInterface } from '../../Interfaces/bassin.interface';
import { PuitInterface } from '../../Interfaces/puit.interface';
import { EntretienSourceEauInterface } from '../../Interfaces/entretien-source-eau.interface';
import { EntretienStationInterface } from '../../Interfaces/entretien-station.interface';
import { LavageChimiqueInterface } from '../../Interfaces/lavage-chimique.interface';
import { EquipementInterface } from '../../Interfaces/equipement.interface';
import { TypeEquipementInterface } from '../../Interfaces/type-equipement.interface';
import { CartoucheInterface } from '../../Interfaces/cartouche.interface';
import { MembraneInterface } from '../../Interfaces/membrane.interface';
import { CategorieProduitChimiqueInterface } from '../../Interfaces/categorie-produit-chimique.interface';
import { FournisseurInterface } from '../../Interfaces/fournisseur.interface';
import { DosageChimiqueInterface } from '../../Interfaces/dosage-chimique.interface';
import { RoleInterface } from '../../Interfaces/role.interface';
import { ProduitChimiqueInterface } from '../../Interfaces/produit-chimique.interface';
import { ObjectifInterface } from '../../Interfaces/objectif.interface';
import { TypeCartoucheInterface } from '../../Interfaces/type-cartouche.interface';
import { TypeMembraneInterface } from '../../Interfaces/type-membrane.interface';
import { UniteInterface } from '../../Interfaces/unite.interface';
import { ChecklistInterface } from '../../Interfaces/checklist.interface';
import { ParametreStationInterface } from '../../Interfaces/parametre-station.interface';
import { ParametreSuiviInterface } from '../../Interfaces/parametre-suivi.interface';
import { SuiviQuotidienInterface } from '../../Interfaces/suivi-quotidien.interface';
import { TypeSuiviInterface } from '../../Interfaces/type-suivi.interface';
import { NatureEquipementInterface } from '../../Interfaces/nature-equipement.interface';

type DialogData =
  | { compte?: CompteInterface }
  | { role?: RoleInterface }
  | { filiale?: FilialeInterface }
  | { atelier?: AtelierInterface }
  | { station?: StationInterface }
  | { bassin?: BassinInterface }
  | { puit?: PuitInterface }
  | { entretienSourceEau?: EntretienSourceEauInterface }
  | { entretienStation?: EntretienStationInterface }
  | { lavageChimique?: LavageChimiqueInterface }
  | { equipement?: EquipementInterface }
  | { natureEquipement?: NatureEquipementInterface }
  | { typeEquipement?: TypeEquipementInterface }
  | { cartouche?: CartoucheInterface }
  | { typeCartouche?: TypeCartoucheInterface }
  | { membrane?: MembraneInterface }
  | { typeMembrane?: TypeMembraneInterface }
  | { categorieProduitChimique?: CategorieProduitChimiqueInterface }
  | { dosageChimique?: DosageChimiqueInterface }
  | { fournisseur?: FournisseurInterface }
  | { produitChimique?: ProduitChimiqueInterface }
  | { unite?: UniteInterface }
  | { checklist?: ChecklistInterface }
  | { objectif?: ObjectifInterface }
  | { parametreStation?: ParametreStationInterface }
  | { parametreSuivi?: ParametreSuiviInterface }
  | { suiviQuotidien?: SuiviQuotidienInterface }
  | { typeSuivi?: TypeSuiviInterface };

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [MaterialModules, NgIf],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss',
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  isCompteData(data: DialogData): data is { compte: CompteInterface } {
    return 'compte' in data;
  }

  isFilialeData(data: DialogData): data is { filiale: FilialeInterface } {
    return 'filiale' in data;
  }
  isAtelierData(data: DialogData): data is { atelier: AtelierInterface } {
    return 'atelier' in data;
  }
  isStationData(data: DialogData): data is { station: StationInterface } {
    return 'station' in data;
  }

  isBassinData(data: DialogData): data is { bassin: BassinInterface } {
    return 'bassin' in data;
  }

  isPuitData(data: DialogData): data is { puit: PuitInterface } {
    return 'puit' in data;
  }

  isEntretienSourceEauData(
    data: DialogData
  ): data is { entretienSourceEau: EntretienSourceEauInterface } {
    return 'entretienSourceEau' in data;
  }

  isEntretienStationData(
    data: DialogData
  ): data is { entretienStation: EntretienStationInterface } {
    return 'entretienStation' in data;
  }

  isLavageChimiqueData(
    data: DialogData
  ): data is { lavageChimique: LavageChimiqueInterface } {
    return 'lavageChimique' in data;
  }

  isEquipementData(
    data: DialogData
  ): data is { equipement: EquipementInterface } {
    return 'equipement' in data;
  }

  isNatureEquipementData(
    data: DialogData
  ): data is { natureEquipement: NatureEquipementInterface } {
    return 'natureEquipement' in data;
  }

  isTypeEquipementData(
    data: DialogData
  ): data is { typeEquipement: TypeEquipementInterface } {
    return 'typeEquipement' in data;
  }

  isCartoucheData(data: DialogData): data is { cartouche: CartoucheInterface } {
    return 'cartouche' in data;
  }

  isTypeCartoucheData(
    data: DialogData
  ): data is { typeCartouche: TypeCartoucheInterface } {
    return 'typeCartouche' in data;
  }

  isMembraneData(data: DialogData): data is { membrane: MembraneInterface } {
    return 'membrane' in data;
  }

  isTypeMembraneData(
    data: DialogData
  ): data is { typeMembrane: TypeMembraneInterface } {
    return 'typeMembrane' in data;
  }

  isCategorieProduitChimiqueData(
    data: DialogData
  ): data is { categorieProduitChimique: CategorieProduitChimiqueInterface } {
    return 'categorieProduitChimique' in data;
  }

  isDosageChimiqueData(
    data: DialogData
  ): data is { dosageChimique: DosageChimiqueInterface } {
    return 'dosageChimique' in data;
  }

  isFournisseurData(
    data: DialogData
  ): data is { fournisseur: FournisseurInterface } {
    return 'fournisseur' in data;
  }

  isProduitChimiqueData(
    data: DialogData
  ): data is { produitChimique: ProduitChimiqueInterface } {
    return 'produitChimique' in data;
  }

  isUniteData(data: DialogData): data is { unite: UniteInterface } {
    return 'unite' in data;
  }

  isChecklistData(data: DialogData): data is { checklist: ChecklistInterface } {
    return 'checklist' in data;
  }

  isObjectifData(data: DialogData): data is { objectif: ObjectifInterface } {
    return 'objectif' in data;
  }

  isParametreStationData(
    data: DialogData
  ): data is { parametreStation: ParametreStationInterface } {
    return 'parametreStation' in data;
  }

  isParametreSuiviData(
    data: DialogData
  ): data is { parametreSuivi: ParametreSuiviInterface } {
    return 'parametreSuivi' in data;
  }

  isSuiviQuotidienData(
    data: DialogData
  ): data is { suiviQuotidien: SuiviQuotidienInterface } {
    return 'suiviQuotidien' in data;
  }

  isTypeSuiviData(data: DialogData): data is { typeSuivi: TypeSuiviInterface } {
    return 'typeSuivi' in data;
  }
}
