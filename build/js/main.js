var inputname;
var uuid = "b3597437-2fb4-45bd-bbdc-4d87df3ebd10" //identificador de la máquina
var started = false; // Control de inicio de partida
var imageClicked = false;
var previous = -1;
var previousJar = 0; // ütil para saber si la pareja anterior corresponde al mismo grupo o no
var tries = 0; // Intentos

var encerts = new Array(); // Nos almacenamos la posición en el array de imágenes de aquellas parejas que ya han sido descubiertas por el jugador

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  } ;

//Dividimos el tablero en dos grupos de imágenes para formar parejas con las mismas imágenes
var A= new Array(); 
var B= new Array();

//Asignamos la url de las imagenes a cada una de las parejas
var Aurl = new Array();
var Burl = new Array();

//Nos indica las parejas encontradas
var found = new Array(10);

var int = 0; //El siguiente numero de casilla de parejas que le vamos a asignar la misma fotografia

//Primera y segunda fotografia de la pareja seleccionada
var first;
var second;

//Inicia el juego
function init()
{
    document.getElementById("tablero").style.display = "grid";
    document.getElementById("rankingBody").style.display = "none";

    started = true;
    createPartners();
    requestImageUrls();
    grid = document.getElementById("tablero");
    grid.style.backgroundColor = "#2196F3";

   document.getElementById("cap").style.display = "none";
   document.getElementById("tries").style.display = "block";
}

//Conjunto de peticiones AJAX GET al servidor
var ajaxGETPIc = 
{
    request: function (url){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", reqListenerPic); xhr.open("GET", url, true);
    xhr.send();
    } };

function reqListenerPic () 
{
    var Pic = JSON.parse(this.responseText); 
    var url = Pic.url;

    Aurl[int] = url;
    Burl[int] = url;

    int++;
}

var ajaxGETRanking = 
{
    request: function (url){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", reqListenerRanking); 
    xhr.open("GET", url, true);
    xhr.send();
    } };

// Ordena el ranking de menor a mayor
function sortRanking(obj)
{ 
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); 

	sortable.sort(function(a, b)
	{
	  return a[1]-b[1]; 
	});
	return sortable; 
}

function reqListenerRanking () 
{
    var Ranking = JSON.parse(this.responseText); 
    var sortedRanking = sortRanking(Ranking);
    console.log(sortedRanking);
    console.log(sortedRanking[1][0]);
    var jugador = "J";
    var puntuacion = "P";

    for(i = 1; i< 11; i++)
    {
        var jugadoraux;
        jugadoraux = jugador + i.toString();
        var puntuacionaux = puntuacion + i;
        puntuacionaux = puntuacion + i.toString();

        document.getElementById(jugadoraux).innerHTML = sortedRanking[i][0];
        document.getElementById(puntuacionaux).innerHTML = sortedRanking[i][1];

    }

}

function requestImageUrls()
{ 
    var baseURl = "http://www.splashbase.co/api/v1/images/1";
    for (i = 0; i<10; i++)
    {
        completeURL = baseURl + Math.floor((Math.random() * 150) + 1);
        ajaxGETPIc.request(completeURL); 
    }  
}

//Crea las parejas de fotos
function createPartners()
{
    var number;
    for(i=0; i<10; i++)
    {   
        do{
            number = Math.floor((Math.random() * 20) + 1);
        }while(A.indexOf(number)!== -1);
        A.push(number);
    }

    for(i=0; i<10; i++)
    {   
        do{
            number = Math.floor((Math.random() * 20) + 1);
        }while(A.indexOf(number) !== -1 || B.indexOf(number)!== -1 );
        B.push(number);
    }
}

//Muestra el ránking por pantalla
function showRanking()
{
    document.getElementById("tablero").style.display = "none";
    document.getElementById("rankingBody").style.display = "block";
    
    var url = "http://puigpedros.salleurl.edu/pwi/pac4/memory.php?token=";
    url = url+uuid;

    ajaxGETRanking.request(url); 
}



/*
Responde a un click en la imagen
Controla que no se trate de una pareja ya encontrada
Cuenta los intentos
En caso de encontrar parejas las marca visualmente como tales
*/
function reply_click(clicked_id)
{
    if(started)
    {
        var url;
        var pos;
        var currentJar;
        var first;
        var second;
    
        var sameRegister = false;
      
        clicked = document.getElementById(clicked_id);
         
         id = parseInt(clicked_id);
    
         if(A.indexOf(id) !== -1 )
         {
           pos = A.indexOf(id);
           url = Aurl[pos];
    
           currentJar = 1;
         }else
         {
           pos = B.indexOf(id);
           url = Burl[pos] ;
           
           currentJar = 2;
         }
    
         //Sólo actuaremos en caso de que no sean parejas ya encontradas
         if(encerts.indexOf(pos) === -1)
         {
            clicked.style.backgroundImage = 'url('+url+')';
    
            if(imageClicked === false)
            {
                previousJar = currentJar;
                imageClicked = true;
                previous = pos;
            }
            else
            {
                tries++;
                intents = document.getElementById("tries");
                var string = "Intents : ";
                string = string + tries;
                intents.innerHTML = string;
                if(previousJar !== currentJar)
                {  
                    if(previousJar === 1)
                    {
                        first = document.getElementById(A[previous]);
                        second = document.getElementById(B[pos]);
                    }else{
                        first = document.getElementById(B[previous]);
                        second = document.getElementById(A[pos]);
                    }
                    
                    if(pos == previous)
                    {
                        console.log("same");
                        sameRegister = true
                    }
                    else{
                    
                        console.log("Different Jar, Different images");
                    }
    
                }else
                {
                    if(previousJar === 1)
                    {
                        first = document.getElementById(A[pos]);
                        second = document.getElementById(A[previous]);
                        console.log("same Jar A");
                    }
                    else
                    {
                        first = document.getElementById(B[pos]);
                        second = document.getElementById(B[previous]);
                        console.log("same Jar B");
                    }  
                }
                    imageClicked = false;
                    previous = -1;
                    previousJar = 0;
                }
                sleep(500).then(() => 
                {   
                    first.style.backgroundImage = 'none';
                    second.style.backgroundImage = 'none';
                    if(sameRegister == true)
                    {
                        sameRegister = false;
                        console.log("Encerts");
                        encerts.push(pos);
                        console.log(encerts);
                    
                        first.style.backgroundColor = "red";
                        second.style.backgroundColor = "red";
                        
                        if(encerts.length === 10)
                        {
                            finished();
                        }
                        
                    }            
                })
                
            }
    }
}
//Peticiones AJAX tipo POST
function reqListenerPOST () {}
   
var ajaxPOST = {
    request: function (url){
        var xhr = new XMLHttpRequest();
        
    xhr.addEventListener("load",reqListenerPOST);
        xhr.open("POST", url,true);
        //console.log(stringSend);
        //console.log(pass);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        stringSend = "jugador="+encodeURIComponent(inputname)+"&intentos="+encodeURIComponent(tries);
        xhr.send(stringSend);

        if(xhr.status == 0)
        {
            //document.getElementById("response").innerHTML = "Acceso Concedido";
        }else{
            //document.getElementById("response").innerHTML = "ERROR 404";
        }
    }
};

//Envia el resultado de la partida al servidor
function submit()
{
    inputname = document.getElementById("input_name").value;
    var url = "http://puigpedros.salleurl.edu/pwi/pac4/memory.php?token=";
    url = url+uuid;

    ajaxPOST.request(url);   

    document.getElementById("sendInformation").style.display = "none";
    document.getElementById("tablero").style.display = "grid";
    document.getElementById("tries").style.display = "block";
    document.getElementById("cap").style.display = "block";

    sleep(500).then(() => 
    {  
        throw window.location.assign('index.html');
    })
}

//Maneja el fin del partida
function finished()
{
    console.log("Finished");
    started = false;
    intents = document.getElementById(5).innerHTML = "G";
    intents = document.getElementById(6).innerHTML = "A";
    intents = document.getElementById(7).innerHTML = "M";
    intents = document.getElementById(8).innerHTML = "E";
    intents = document.getElementById(9).innerHTML = "O";
    intents = document.getElementById(10).innerHTML = "V";
    intents = document.getElementById(11).innerHTML = "E";
    intents = document.getElementById(12).innerHTML = "R";  
    document.getElementById("sendInformation").style.display = "block";
    document.getElementById("tablero").style.display = "none";
    document.getElementById("tries").style.display = "none";
}






    

