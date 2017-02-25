import { connect } from 'react-redux';

import { createTestAccount, setAccount } from '../../../actions-creators/account';

import AccountSelector from './component';
import {
  isAccountLoading,
  isCreatingTestAccount,
  getAccount,
  getAccountError,
  getKeypair,
  canSign,
} from '../../../selectors/account';
import {
  getNetwork,
} from '../../../selectors/stellarData';

const mapStateToProps = (state) => ({
  isAccountLoading: isAccountLoading(state),
  isCreatingTestAccount: isCreatingTestAccount(state),
  account: getAccount(state),
  canSign: canSign(state),
  error: getAccountError(state),
  keypair: getKeypair(state),
  network: getNetwork(state),
});

const mapDispatchToProps = { setAccount, createTestAccount };

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelector);
