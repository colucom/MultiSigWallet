(
  function () {
    angular
    .module("multiSigWeb")
    .controller("confirmTransactionCtrl", function (Web3Service, $scope, txId, address, Wallet, Transaction, $uibModalInstance, Utils) {
      $scope.tx = {};

      $scope.calculateGas = function () {
         Web3Service.web3.eth.getGasPrice(
          function (e, gasPrice) {
            if (e) {
              Utils.dangerAlert(e);
            }
            else {
              $scope.tx.gasPrice = gasPrice.toNumber();
            }
          }
        );
      };

      $scope.send = function () {
        Wallet.confirmTransaction(address, txId, {onlySimulate: false, gasPrice: $scope.tx.gasPrice}, function (e, tx) {
          if (e) {
            Utils.dangerAlert(e);
          }
          else {
            Utils.notification("Confirmation transaction was sent.");
            Transaction.add({txHash: tx, callback: function () {
              Utils.success("Confirmation transaction was mined.");
            }});
            $uibModalInstance.close();
          }
        });
      };

      $scope.simulate = function () {
        Wallet.confirmTransaction(address, txId, {onlySimulate: true, gasPrice: $scope.tx.gasPrice}, function (e, tx) {
          if (e) {
            Utils.dangerAlert(e);
          }
          else {
            Utils.simulatedTransaction(tx);
          }
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    });
  }
)();
