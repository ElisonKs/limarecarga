( function( $ ) {


$(".main__button").on("click",function(){
  fbq('track', 'Clicou');
  window.open('https://lashdesignerbrasil.com/limarecarga', '_blank');
})





  function init() {
    console.log( "init" );
  }

  init();
} )( jQuery );
