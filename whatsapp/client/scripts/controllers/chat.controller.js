angular
.module('Whatsapp')
.controller('ChatCtrl', ChatCtrl);

function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout) {
  $reactive(this).attach($scope);

  let chatId = $stateParams.chatId;
  let isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  this.sendMessage = sendMessage;
  this.inputUp = inputUp;
  this.inputDown = inputDown;
  this.closeKeyboard = closeKeyboard;
  this.helpers({
    messages() {
      return Messages.find({ chatId: chatId });
    },
    data() {
      return Chats.findOne(chatId);
    },
  });

$scope.$watchCollection('chat.messages', (oldVal, newVal) => {
  let animate = oldVal.length !== newVal.length;
  $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
});

////////////

  function sendPicture() {
    MeteorCameraUI.getPicture({}, (err, data) =>{
      if (err) return this.handleError(err);

      this.callMethod('newMessage', {
        picture: data,
        type: 'picture',
        chatId: this.chatId
      });
    });
  }

  function sendMessage() {
  if (_.isEmpty(this.message)) return;

  Meteor.call('newMessage', {
    text: this.message,
    type: 'text',
    chatId: chatId
  });

  delete this.message;
  }

  function inputUp() {
    if (isIOS) {
      this.keyboardHeight = 216;
    }

    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);
  }

  function inputDown(){ 
    if (isIOS) {
      this.keyboardHeight = 0;
    }

    $ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  function closeKeyboard() {
    // cordova.plugins.Keyboard.close();
  }

  handleError(err) {
      if (err.error == 'cancel') return;
      this.$log.error('Profile save error ', err);
   
      this.$ionicPopup.alert({
        title: err.reason || 'Save failed',
        template: 'Please try again',
        okType: 'button-positive button-clear'
      });
    }
}

ChatCtrl.$inject = ['$scope', '$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
