import Rx from "rxjs";
import {
    loading,
    PRINT_SUBMITTED,
    onPrintResponse
} from "@mapstore/ext/cadastrapp/actions/cadastrapp";
import isEmpty from "lodash/isEmpty";
import { wrapStartStop } from "@mapstore/observables/epics";
import { error } from "@mapstore/actions/notifications";
import {
    createDemandeFromObj,
    printPDFRequest,
    saveInformationRequest
} from "@mapstore/ext/cadastrapp/api";
import {downloadResponse} from "@mapstore/ext/cadastrapp/utils/download";

/**
 * Epic to print request data and generate documents based on requested data
 * @param action$
 * @param getState
 * @return {*}
 */
export const saveInformationRequestEpic = (
    action$,
    { getState = () => {} }
) =>
    action$.ofType(PRINT_SUBMITTED).switchMap(({ printParams, printType = "Print" }) => {
        let observable$ = Rx.Observable.empty();
        if (printType === "Print") {
            observable$ = Rx.Observable.defer(() =>
                saveInformationRequest(printParams)
            ).switchMap(data => {
                return isEmpty(data)
                    ? Rx.Observable.empty()
                    : Rx.Observable.defer(() =>
                        printPDFRequest(data.id).then(pdfBlob => {
                            downloadResponse(pdfBlob, {});
                            return onPrintResponse(data.id);
                        })
                    );
            });
        } else {
            const requestId = getState().cadastrapp?.requestFormData?.requestId;
            if (requestId) {
                observable$ = Rx.Observable.defer(() =>
                    createDemandeFromObj(requestId).then(pdfBlob => {
                        downloadResponse(pdfBlob, {});
                        return onPrintResponse(null, false);
                    })
                );
            }
        }
        return observable$.let(
            wrapStartStop(
                [loading(true, "printing")],
                loading(false, "printing"),
                () => {
                    return Rx.Observable.of(
                        error({
                            title: "Error",
                            message: "cadastrapp.requestForm.printError"
                        }),
                        loading(false, "printing")
                    );
                }
            )
        );
    });
