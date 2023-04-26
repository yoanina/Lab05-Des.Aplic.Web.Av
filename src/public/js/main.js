$(function(){
    const socket = io();
    const users = [];
    var nick = '';
    hora = new Date().toLocaleTimeString();
    //Obtenemos los elementos del DOM
    
    const messageForm = $('#messages-form');
    const messageBox = $('#message');
    const chat = $('#chat');

    const nickForm = $('#nick-form');
    const nickError = $('#nick-error');
    const nickName = $('#nick-name');
    const image = $('images')

    const userNames = $('#usernames');
    


    //Eventos

    messageForm.submit( e =>{
        //Evitamos que se recargue la pantalla:
        e.preventDefault();
       
        //Enviamos el evento que debe recibir el servidor:
        socket.emit('enviar mensaje',  messageBox.val());
        
        //Limpiamos el input
        messageBox.val('');
        
    });

    //Obtenemos respuesta del servidor:

    socket.on('nuevo mensaje', function(datos){
        hora = new Date().toLocaleTimeString();
        
        let color = '#f5f4f4';
        let position = (nick == datos.nick) ? 'right' : 'left';

        if(nick == datos.nick){
            color = '#e7c892';
            color1 = 'pink';
        }
        

        chat.append(`
        <div class="msg-area mb-2 ${position} " style="background-color:${color}">
            <p class="msg"><b>${datos.nick} 
            <n style="color:gray; font-size:11px" >(${hora})</n>:</b> ${datos.msg}</p>
        </div>
        `);

    });
    


    nickForm.submit( e =>{
        e.preventDefault();
        console.log('Enviando...');
        socket.emit('nuevo usuario', nickName.val(), datos =>{
            if(datos){
                nick = nickName.val();
                $('#nick-wrap').hide();
                $('#content-wrap').show();
                
            }else{
                nickError.html(`
                <div class="alert alert-danger">
                El usuario ya existe
                </div>
                `); 
            }
            nickName.val('');
        });

    });

    //Obtenemos el array de usuarios de sockets.js
    socket.on('usernames', datos =>{
        let html = '';
        let color = '#000';
        let salir = '';
        console.log(nick);
        for(let i = 0; i < datos.length; i++){
            if(nick == datos[i]){
                color = '#e7c892';
                salir = `<a class="enlace-salir" href="/"><i class="fas fa-sign-out-alt salir"></i></a>`;
            }else{
                color = '#000';
                salir = '';
            }
            html += `<p style="color:${color}"><i class="fas fa-user"></i> ${datos[i]} ${salir}</p>`;
        }

        userNames.html(html);
    });

});