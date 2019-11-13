import * as React from 'react';

import {Globals} from '../../../Globals';
import {WelcomeScreen} from '../../../Screens/General/WelcomeScreen';

/*--- Tracker actions ---*/
import {TRFootLabels} from '../../../Screens/Tracker/TRFootLabels';
import {StandardTimes} from '../../../Screens/Tracker/StandardTimes';
import {TrazaVRF} from '../../../Screens/Tracker/TrazaVRF';
import {CheckListsVRF} from '../../../Screens/Tracker/CheckListsVRF';
import {GestionUsuarios} from '../../../Screens/General/GestionUsuarios';

/*--- ISuggest Admin ---*/
import {ISEstadosIncidencias} from '../../../Screens/ISuggestAdmin/ISEstadosIncidencias';
import {ISSecciones} from '../../../Screens/ISuggestAdmin/ISSecciones';
import {ISZonas} from '../../../Screens/ISuggestAdmin/ISZonas';

/*--- ISuggest Application ---*/
import {ISSugerenciasPendientes} from '../../../Screens/ISuggestApp/ISSugerenciasPendientes';
import {ISSugerenciasEvaluando} from '../../../Screens/ISuggestApp/ISSugerenciasEvaluando';
import {ISSugerenciasSuspendidas} from "../../../Screens/ISuggestApp/ISSugerenciasSuspendidas";

/*--- InfoPanels Application ---*/
import {IPGestionColas} from "../../../Screens/InfoPanels/IPGestionColas";
import {IPGestionContenidoColas} from "../../../Screens/InfoPanels/IPGestionContenidoColas";
/*--- PCBBurner Application ---*/
import {Audits} from '../../../Screens/PCBBurning/Audits';

/*--- Partes de producción ---*/
import {PPZonas} from '../../../Screens/PartesProduccion/Admin/PPZonas';
import {PPTurnos} from '../../../Screens/PartesProduccion/Admin/PPTurnos';
import {PPEstadosZona} from '../../../Screens/PartesProduccion/Admin/PPEstadosZona';
import {PPMaquinas} from '../../../Screens/PartesProduccion/Admin/PPMaquinas';
import {PPAreas} from '../../../Screens/PartesProduccion/Admin/PPAreas';
import {PPEstadosIncidencia} from '../../../Screens/PartesProduccion/Admin/PPEstadosIncidencia';
import {PPartesProduccion} from '../../../Screens/PartesProduccion/PPartesProduccion';

import './container.css';
import {ChangePassword} from "../../../Screens/General/ChangePassword";
import {VisitasPlanta} from "../../../Screens/InfoPanels/VisitasPlanta";
import {ISAccionesSugerencia} from "../../../Screens/ISuggestApp/ISAccionesSugerencia";
import {ISSugerenciasCompletadas} from "../../../Screens/ISuggestApp/ISSugerenciasCompletadas";
import {ISAccionesGeneral} from "../../../Screens/ISuggestApp/ISAccionesGeneral";
import {ISSugerenciasDescartadas} from "../../../Screens/ISuggestApp/ISSugerenciasDescartadas";
import {ConsumosGas} from "../../../Screens/ConsumosGas/ConsumosGas";
import {ImageTrace} from "../../../Screens/ImageTrace/ImageTrace";
import {TiposAutorizaciones} from "../../../Screens/General/TiposAutorizaciones";
import {PPMttrMtbf} from "../../../Screens/PartesProduccion/Admin/PPMttrMtbf";
import {TrackerUtils} from "../../../Screens/Tracker/TrackerUtils";
import {PPAdherence} from "../../../Screens/PartesProduccion/Admin/PPAdherence";
import {ConceptosParo} from "../../../Screens/PartesProduccion/Admin/ConceptosParo";
import {ZonasLineaProduccion} from "../../../Screens/PartesProduccion/Admin/ZonasLineaProduccion";
import {ConfigMensual} from "../../../Screens/PartesProduccion/ConfigMensual";
import {EtiquetasKanban} from "../../../Screens/Tracker/EtiquetasKanban";
import {TestScreen} from "../../../Screens/Test/TestScreen";
import {CommercialTests} from "../../../Screens/Tracker/CommercialTests";
import {ReglasTrazado} from "../../../Screens/Tracker/ReglasTrazado";
import {ARQSecciones} from "../../../Screens/Produccion/ARQSecciones";
import {ARQLineasPorSeccion} from "../../../Screens/Produccion/ARQLineasPorSeccion";
import {ARQPuestosPorLineas} from "../../../Screens/Produccion/ARQPuestosPorLineas";
import {ARQMaquinasPorPuesto} from "../../../Screens/Produccion/ARQMaquinasPorPuesto";
import {ARQProductionTree} from "../../../Screens/Produccion/ARQProductionTree";
import {ARQTiposMaquina} from "../../../Screens/Produccion/ARQTiposMaquina";
import {DescuadresSGAs} from "../../../Screens/Tracker/DescuadresSGAs";
import {TiposNotificaciones} from "../../../Screens/General/TiposNotificaciones";
import {NotificacionesPredefinidas} from "../../../Screens/General/NotificacionesPredefinidas";
import {ControlPresencia} from "../../../Screens/ControlPresencia/ControlPresencia";
import {PlanningOFs} from "../../../Screens/Tracker/PlanningOFs";
import {GestionInventarioMaquinas} from "../../../Screens/General/GestionInventarioMaquinas";
import {NotificacionesGenerator} from "../../../Screens/General/NotificacionesGenerator";
import {TaskTypes} from "../../../Screens/Tasks/TaskTypes";
import {TaskOrigins} from "../../../Screens/Tasks/TaskOrigins";
import {TaskCategories} from "../../../Screens/Tasks/TaskCategories";
import {TaskNew} from "../../../Screens/Tasks/TaskNew";
import {MyEntries} from "../../../Screens/Tasks/MyEntries";
import {MyPendingTasks} from "../../../Screens/Tasks/MyPendingTasks";
import {Procedures} from "../../../Screens/Procedures/Procedures";
import {ProceduresToSign} from "../../../Screens/Procedures/ProceduresToSign";
import {CheckProcedures} from "../../../Screens/Procedures/CheckProcedures";
import {ConditionalTest} from "../../../Screens/Test/ConditionalTest";
import {CircuitosFirmas} from "../../../Screens/General/CircuitosFirmas";
import {FirmasCircuito} from "../../../Screens/General/FirmasCircuito";
import {TaskPlanner} from "../../../Screens/Tasks/TaskPlanner";
import {MyEvaluationsPending} from "../../../Screens/Tasks/MyEvaluationsPending";
import {MyPendingPurchases} from "../../../Screens/Tasks/MyPendingPurchases";
import {MyPurchasesToFinish} from "../../../Screens/Tasks/MyPurchasesToFinish";
import {TasksInExecution} from "../../../Screens/Tasks/TasksInExecution";
import {TasksStats} from "../../../Screens/Tasks/Stats/TasksStats";
import {MyTasksToDo} from "../../../Screens/Tasks/MyTasksToDo";
import {TaskCierresMesPorAntiguedad} from "../../../Screens/Tasks/Stats/TaskCierresMesPorAntiguedad";
import {TasksAperturasCierresTotal} from "../../../Screens/Tasks/Stats/TasksAperturasCierresTotal";

/*--- Rfid Contenedores ---*/

import {RfidTiposContenedores} from "../../../Screens/RfidContenedores/RfidTiposContenedores";
import {BudgetResume} from "../../../Screens/Tasks/BudgetResume";
import {MyTasksToValidate} from "../../../Screens/Tasks/MyTasksToValidate";
import {SoftwareConfig} from "../../../Screens/PCBBurning/SoftwareConfig";
import {AveriaNew} from "../../../Screens/Tasks/AveriaNew";
import {ARQModelosPorSeccion} from "../../../Screens/Produccion/ARQModelosPorSeccion";

interface ContainerProps {
    ActiveForm: string
    isLeftMenuOpened: boolean;
}

export class Container extends React.Component<ContainerProps, any> {
    constructor() {
        super();
    }

    render() {
        let leftWidthClass = "left_opened";
        let rightWidthClass = "right_opened";
        if (!this.props.isLeftMenuOpened) {
            leftWidthClass = "left_closed";
            rightWidthClass = "right_closed";
        }
        if (window.location.pathname.includes("desarrollo")) {
            console.log("Active screen: " + this.props.ActiveForm);
        }

        return (
            <div className='containerGeneral'>
                <div className={'containerLeftColumn ' + leftWidthClass}></div>
                <div className={'containerRightColumn ' + rightWidthClass}>
                    {this.props.ActiveForm == "WelcomeForm" ? <WelcomeScreen/> : null}
                    {this.props.ActiveForm == "Tracker_StandardTimes" ? <StandardTimes/> : null}

                    {this.props.ActiveForm == "FrmUserMgmt" ? <GestionUsuarios/> : null}
                    {this.props.ActiveForm == "FrmCircuitosFirmas" ? <CircuitosFirmas/> : null}
                    {this.props.ActiveForm == "FrmFirmasCircuito" ? <FirmasCircuito/> : null}
                    {this.props.ActiveForm == "FrmMachineInventory" ? <GestionInventarioMaquinas/>: null}
                    {this.props.ActiveForm == "FrmAuthTypes" ? <TiposAutorizaciones/> : null}
                    {this.props.ActiveForm == "FrmTiposNotificaciones" ? <TiposNotificaciones/>: null}
                    {this.props.ActiveForm == "FrmNotificacionesPredefinidas" ? <NotificacionesPredefinidas/>:null}
                    {this.props.ActiveForm == "FrmNotificacionesGenerator" ? <NotificacionesGenerator/>:null}
                    {this.props.ActiveForm == "FrmPlanningProduccion" ? <PlanningOFs/>: null}

                    {this.props.ActiveForm == "FrmTaskTypes" ? <TaskTypes/>: null}
                    {this.props.ActiveForm == "FrmTaskOrigins" ? <TaskOrigins/>: null}
                    {this.props.ActiveForm == "FrmTaskCategories" ? <TaskCategories/> : null}
                    {this.props.ActiveForm == "FrmTaskNew" ? <TaskNew/>: null}
                    {this.props.ActiveForm == "FrmAveriaNew" ? <AveriaNew/>: null}
                    {this.props.ActiveForm == "FrmMyEntries" ? <MyEntries/> : null}
                    {this.props.ActiveForm == "FrmTaskPlanner" ? <TaskPlanner/> :null}
                    {this.props.ActiveForm == "FrmMyPendingTasks" ? <MyPendingTasks/> : null}
                    {this.props.ActiveForm == "FrmMyEvaluationsPending" ? <MyEvaluationsPending/>: null}
                    {this.props.ActiveForm == "FrmMyPendingPurchases" ? <MyPendingPurchases/>: null}
                    {this.props.ActiveForm == "FrmMyPurchasesToFinish" ? <MyPurchasesToFinish/>:null}
                    {this.props.ActiveForm == "FrmTasksInExecution" ? <TasksInExecution/>: null}
                    {this.props.ActiveForm == "FrmHelpdeskBudgets" ? <BudgetResume/>: null}
                    {this.props.ActiveForm == "FrmMyTasksToValidate" ? <MyTasksToValidate/>: null}

                    {this.props.ActiveForm == "FrmHelpdeskStats" ? <TasksStats/>:null}
                    {this.props.ActiveForm == "FrmHelpdeskOpenedByOld" ? <TaskCierresMesPorAntiguedad/>:null}
                    {this.props.ActiveForm == "FrmHelpdeskOpenCloseTotals" ? <TasksAperturasCierresTotal/>:null}

                    {this.props.ActiveForm == "FrmMyTasksToDo" ? <MyTasksToDo/>: null}

                    {this.props.ActiveForm == "FrmProcedures" ? <Procedures/>: null}
                    {this.props.ActiveForm == "FrmCheckProcedures" ? <CheckProcedures/>: null}
                    {this.props.ActiveForm == "FrmPendingSignatures" ? <ProceduresToSign/>:null}

                    {this.props.ActiveForm == "FrmRegistroMarcajes" ? <ControlPresencia/>: null}

                    {this.props.ActiveForm == "ISuggest_EstadosIncidencias" ? <ISEstadosIncidencias/> : null}
                    {this.props.ActiveForm == "ISuggest_Secciones" ? <ISSecciones/> : null}
                    {this.props.ActiveForm == "ISuggest_Zonas" ? <ISZonas/> : null}

                    {this.props.ActiveForm == "ISuggestApp_sugerenciasPendientes" ? <ISSugerenciasPendientes/> : null}
                    {this.props.ActiveForm == "ISuggestApp_sugerenciasEvaluandose" ? <ISSugerenciasEvaluando/> : null}
                    {this.props.ActiveForm == "ISuggestApp_sugerenciasSuspendidas" ? <ISSugerenciasSuspendidas/> : null}
                    {this.props.ActiveForm == "ISuggestApp_SubForm_AccionesSugerencia" ? <ISAccionesSugerencia/> : null}
                    {this.props.ActiveForm == "ISuggestApp_accionesGeneral" ? <ISAccionesGeneral/> : null}
                    {this.props.ActiveForm == "ISuggestApp_sugerenciasCompletadas" ? <ISSugerenciasCompletadas/> : null}
                    {this.props.ActiveForm == "ISuggestApp_sugerenciasDescartadas" ? <ISSugerenciasDescartadas/> : null}

                    {this.props.ActiveForm == "Tracker_printFootLabel" ? <TRFootLabels/> : null}
                    {this.props.ActiveForm == "Tracker_trazaVRF" ? <TrazaVRF/> : null}
                    {this.props.ActiveForm == "Tracker_ReglasTrazado" ? <ReglasTrazado/> : null}
                    {this.props.ActiveForm == "Tracker_CheckListsVRF" ? <CheckListsVRF/> : null}
                    {this.props.ActiveForm == "Tracker_Utilities" ? <TrackerUtils/> : null}

                    {this.props.ActiveForm == "PCBBurning_Audits" ? <Audits/> : null}
                    {this.props.ActiveForm == "PCBBurning_ReglasSoftware" ? <SoftwareConfig/> : null}

                    {this.props.ActiveForm == "PartesProduccion_Zonas" ? <PPZonas/> : null}
                    {this.props.ActiveForm == "PartesProduccion_Turnos" ? <PPTurnos/> : null}
                    {this.props.ActiveForm == "PartesProduccion_EstadosZona" ? <PPEstadosZona/> : null}
                    {this.props.ActiveForm == "PartesProduccion_EstadosIncidencia" ? <PPEstadosIncidencia/> : null}
                    {this.props.ActiveForm == "PartesProduccion_Maquinas" ? <PPMaquinas/> : null}
                    {this.props.ActiveForm == "PartesProduccion_Areas" ? <PPAreas/> : null}
                    {this.props.ActiveForm == "PartesProduccion_Partes" ? <PPartesProduccion/> : null}
                    {this.props.ActiveForm == "PartesProduccion_MttrMtbf" ? <PPMttrMtbf/> : null}
                    {this.props.ActiveForm == "PartesProduccion_Adherence" ? <PPAdherence/> : null}

                    {this.props.ActiveForm == "FrmChangePassword" ? <ChangePassword/> : null}
                    {this.props.ActiveForm == "FrmVisitasPlanta" ? <VisitasPlanta/> : null}

                    {this.props.ActiveForm == "FrmConsumosGas" ? <ConsumosGas/> : null}
                    {this.props.ActiveForm == "FrmImageTrace" ? <ImageTrace/> : null}

                    {this.props.ActiveForm == "FrmGestionColas" ? <IPGestionColas/> : null}
                    {this.props.ActiveForm == "FrmGestionContenidos" ? <IPGestionContenidoColas/> : null}

                    {this.props.ActiveForm == "FrmConceptosParo" ? <ConceptosParo/> : null}
                    {this.props.ActiveForm == "FrmZonasLinea" ? <ZonasLineaProduccion/> : null}
                    {this.props.ActiveForm == "FrmConfiguracionMensual" ? <ConfigMensual/> : null}

                    {this.props.ActiveForm == "FrmEtiquetasKanban" ? <EtiquetasKanban/> : null}

                    {this.props.ActiveForm == "TestScreen" ? <TestScreen/> : null}
                    {this.props.ActiveForm == "TestConditionalForm" ? <ConditionalTest/>: null}

                    {this.props.ActiveForm == "FrmCommercialTests" ? <CommercialTests/> : null}

                    {this.props.ActiveForm == "FrmARQSecciones" ? <ARQSecciones/>:null}
                    {this.props.ActiveForm == "FrmARQLineasPorSeccion" ? <ARQLineasPorSeccion/>: null}
                    {this.props.ActiveForm == "FrmARQPuestosPorLinea" ? <ARQPuestosPorLineas/> :null}
                    {this.props.ActiveForm == "FrmARQMaquinasPorPuesto" ? <ARQMaquinasPorPuesto/>:null}
                    {this.props.ActiveForm == "FrmARQProductionTree" ? <ARQProductionTree/>:null}
                    {this.props.ActiveForm == "FrmARQTiposMaquina" ? <ARQTiposMaquina/>: null}
                    {this.props.ActiveForm == "FrmDescuadresSGAs" ? <DescuadresSGAs/>:null}
                    {this.props.ActiveForm == "FrmARQModelosPorSeccion" ? <ARQModelosPorSeccion/>:null}
                    {this.props.ActiveForm == "RfidTiposContenedores" ? <RfidTiposContenedores/> : null}
                </div>
            </div>
        );
    }
}