import * as StellarHelper from '../helpers/Stellar';

import * as AccountActions from '../actions/account';
import { getKeypair, getAccount } from '../selectors/selector';

const prepareTransaction = (state, dispatch) => {
  const keypair = getKeypair(state);
  const sourceAccount = getAccount(state);

  if (!keypair || !sourceAccount) {
    dispatch(AccountActions.sendPaymentError(new Error("Source account not set")));
    return null;
  }
  if (!keypair.canSign()) {
    dispatch(AccountActions.sendPaymentError(new Error("Source account seed not set")));
    return null;
  }
  return {
    keypair,
    sourceAccount,
  };
};

export const sendPayment = formData => (dispatch, getState) => {
  dispatch(AccountActions.sendingPayment());

  const basicData = prepareTransaction(getState(), dispatch);
  if(!basicData) return;

  const paymentData = {
    ...basicData,
    sourceAccount,
  };

  return StellarHelper
    .sendPayment(paymentData)
    .catch(error =>
      dispatch(AccountActions.sendPaymentError(error))
    )
    .then(d => {
      dispatch(AccountActions.sendPaymentSuccess(d));
    });
};

const changeTrust = ({ asset, limit }) => (dispatch, getState) => {

  const basicData = prepareTransaction(getState(), dispatch);
  if(!basicData) return;

  const transactionData = {
    ...basicData,
    asset,
    limit,
  };

  return StellarHelper
    .changeTrust(transactionData); // TODO receive
};

export const createTrustline = asset => (
  changeTrust({
    asset,
    limit: null,
  })
);
export const deleteTrustline = asset => (
  changeTrust({
    asset,
    limit: "0",
  })
);

export const createOffer = ({ selling,  buying,  amount,  price }) => (dispatch, getState) => {

  const basicData = prepareTransaction(getState(), dispatch);
  if(!basicData) return;

  const transactionData = {
    ...basicData,
    selling,
    buying,
    amount,
    price,
  };

  return StellarHelper
    .createOffer(transactionData); // TODO receive
};