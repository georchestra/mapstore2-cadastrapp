import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Localized from '@mapstore/components/I18N/Localized';
import { createStateMocker } from '@mapstore/reducers/__tests__/reducersTestUtils';


export const applyTestEnv = (Component, {reducers, actions = []} = {}) => {
    const mockStore = configureMockStore();
    const initialState = createStateMocker(reducers)(...actions);
    const store = mockStore(initialState);
    const eng = {
        "locale": "en-US",
        "messages": {
            "aboutLbl": "About"
        }
    };
    const Cmp = (props) => (<Localized messages={eng.messages} locale="en-US">
        <Provider store={store}>
            <Component {...props}/>
        </Provider>
    </Localized>);
    return [store, Cmp];

};
