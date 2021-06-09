routine = 0;
var ArrayRotinas = []
$( document ).ready(function() {
    if (window.location.href.includes("localhost") || window.location.href.includes("192.168.")  ){
        var ws = new WebSocket("ws://localhost:8083?connectionType=dashboard"); 	
    } else {
        var ws = new WebSocket("ws://191.182.176.61:8083?connectionType=dashboard"); 	
    }

    // var ws = new WebSocket("ws://192.168.0.10:8083/");

    ws.onopen = function () {
        console.log("[WEBSOCKETS CONECTADO]")
    };
    ws.onmessage = function(msg){
        dat = JSON.parse(msg.data)
        console.log(dat.name)
        if(dat.name == 'ledquarto'){
            toggleStateButton("Quarto1", dat.value)
        } else if(dat.name == 'ledsala'){
            toggleStateButton("Quarto2", dat.value)
        } else if(dat.name == 'cortina'){
            toggleStateButton("Quarto3", dat.value)
        } else if(dat.name == 'cafeteira'){
            toggleStateButton("Quarto4", dat.value)
        } else if(dat.name == 'banheiro'){
            toggleStateButton("Quarto5", dat.value)
        }
    }

    $('#Quarto1').on('click', function(){
        if($('#Quarto1 img').attr('src') == './img/turn-off.svg'){
            $('#Quarto1 img').attr('src', './img/turn-on.svg')
            sendMessage('ledquarto', 1);
            console.log(1)
        } else {
            $('#Quarto1 img').attr('src', './img/turn-off.svg')
            sendMessage('ledquarto', 0);
            console.log(0)
        }
    })
    $('#Quarto2').on('click', function(){
        if($('#Quarto2 img').attr('src') == './img/turn-off.svg'){
            $('#Quarto2 img').attr('src', './img/turn-on.svg')
            sendMessage('ledsala', 1);
            console.log(1)
        } else {
            $('#Quarto2 img').attr('src', './img/turn-off.svg')
            sendMessage('ledsala', 0);
            console.log(0)
        }
    })
    $('#Quarto3').on('click', function(){
        if($('#Quarto3 img').attr('src') == './img/turn-off.svg'){
            $('#Quarto3 img').attr('src', './img/turn-on.svg')
            sendMessage('cortina', 1);
            console.log(1)
        } else {
            $('#Quarto3 img').attr('src', './img/turn-off.svg')
            sendMessage('cortina', 0);
            console.log(0)
        }
    })
    $('#Quarto4').on('click', function(){
        if($('#Quarto4 img').attr('src') == './img/turn-off.svg'){
            $('#Quarto4 img').attr('src', './img/turn-on.svg')
            sendMessage('cafeteira', 1);
            console.log(1)
        } else {
            $('#Quarto4 img').attr('src', './img/turn-off.svg')
            sendMessage('cafeteira', 0);
            console.log(0)
        }
    })
    $('#Quarto5').on('click', function(){
        if($('#Quarto5 img').attr('src') == './img/turn-off.svg'){
            $('#Quarto5 img').attr('src', './img/turn-on.svg')
            sendMessage('banheiro', 1);
            console.log(1)
        } else {
            $('#Quarto5 img').attr('src', './img/turn-off.svg')
            sendMessage('banheiro', 0);
            console.log(0)
        }
    })
    
    $('#Teams').on('click', function(){
        $("#Controlador").removeClass("hide");
	    $("#GuiaRotinas").addClass("hide");
        $("#Teams").addClass("active");
        $("#Match").removeClass("active");
    })
    $('#Match').on('click', function(){
        $("#Controlador").addClass("hide");
	    $("#GuiaRotinas").removeClass("hide");
        $("#Teams").removeClass("active");
        $("#Match").addClass("active");
    })
    $('#AddAlterarEstado').on('click', function(){
      $('#programarRotina').append(`
      <section id="r${routine + 1}" class="row justify-content-center">
        <div class="mb-4">
          <div class="input-group is-invalid">
            <div class="input-group-prepend">
                <label class="input-group-text" for="validatedInputGroupSelect">Alterar Estado</label>
            </div>
            <select class="custom-select dispositivo" id="validatedInputGroupSelect" required>
                <option value="">Selecione o Dispositivo</option>
                <option value="ledquarto">Quarto 1</option>
                <option value="ledsala">Sala</option>
                <option value="cortina">Cortina Quarto 1</option>
                <option value="cafeteira">Cafeteira</option>
                <option value="banheiro">Banheiro</option>
            </select>
            <select class="custom-select estado" id="validatedInputGroupSelect" required>
                <option value="">Selecione o Estado</option><option value="0">Ligado</option>
                <option value="1">Desligado</option>
            </select>
            <button onClick='excluirPasso("r${routine + 1}")' id="rem-r${routine + 1}" style="margin-right: 10px;" type="button" class="btn btn-secondary">X</button>
          </div>
        </div>
     </section>`)
     routine += 1
    })

    $('#AddDelay').on('click', function(){
      $('#programarRotina').append(`
      <section id="r${routine+1}" class="row justify-content-center">
        <div class="mb-4">
          <div class="input-group is-invalid">
            <div class="input-group-prepend">
              <label class="input-group-text" for="validatedInputGroupSelect">Delay</label>
            </div>
            <input style="text-align: right;" type="text" class="form-control" placeholder="Tempo (ms)">
            <div class="input-group-prepend">
              <label class="input-group-text" for="validatedInputGroupSelect">ms</label>
            </div>
            <button onClick='excluirPasso("r${routine + 1}")' id="rem-r${routine + 1}" style="margin-right: 10px;" type="button" class="btn btn-secondary">X</button>
          </div>
         </div>
       </section>`)
       routine += 1
    })

    $('#Salvar').on('click', function(){
        if($("#Excluir").attr('disabled')){
            getNewRotina()
        } else {
            patchRotina()
        }
    })


    getRotinasAndRender()

    // Estilos diferentes NotifyJs
    $.notify.addStyle('success', {
		html: 
		"<div style='user-select: none; background-color:#2F3136; border: 1px solid #28A745'>" + 
		"<div style='background-color: rgba(40, 167, 69, 0.2); padding: 10px; '>" +
			"<img style='width: 25px; float:left;' src='./img/icn-success.svg'>" +
			"<div style='margin-left: 30px; line-height: 25px; font-weight: bold; color: #28A745;' class='title' data-notify-text>TESTE DE TEXTO</div>" +
		"</div>" +
		"</div>"
	});
	$.notify.addStyle('error', {
		html: 
		"<div style='user-select: none; background-color:#2F3136; border: 1px solid #DC3545'>" + 
		"<div style='background-color: rgba(220, 53, 69, 0.2); padding: 10px; '>" +
			"<img style='width: 25px; float:left;' src='./img/icn-error.svg'>" +
			"<div style='margin-left: 30px; line-height: 25px; font-weight: bold; color: #DC3545;' class='title' data-notify-text>TESTE DE TEXTO</div>" +
		"</div>" +
		"</div>"
	});
});

function patchRotina(){
    var rotina = {
        name:"",
        hora:"",
        passos:[],
        _id:$("#idRotina").val()
    }
    $('#programarRotina section').each(function (indexInArray, element) { 
        console.log(element.id)
        if(element.id == 'hora'){
            rotina.hora = $(`#${element.id} #timepicker`).val()
        } else if ($(`#${element.id} label`).html() == 'Delay'){
            rotina.passos.push(["Delay", parseInt($(`#${element.id} input`).val())])
        } else if ($(`#${element.id} label`).html() == 'Alterar Estado'){
            rotina.passos.push(["Alterar Estado", $(`#${element.id} .dispositivo`).val(), $(`#${element.id} .estado`).val()])
        }

   });

   $.ajax({
    type: 'PATCH',
    url: '/rotinas',
    data: JSON.stringify(rotina),
    success: function(result){
        NotificationUI("Rotina atualizada com sucesso", 'success', true)
        getRotinasAndRender()
    },
    error: function(event, jqxhr, exception) {
        console.log(event)
        if (event.status == 0){
            NotificationUI("Erro ao comunicar com servidor", 'error', true)
        } else if (event.status == 200){
            NotificationUI("Rotina atualizada com sucesso", 'success', true)
            getRotinasAndRender()
        } else {
            NotificationUI(event.responseText, 'error', true)
        }
    },
    contentType: "application/json",
    dataType: 'json'
});

   console.log(rotina)
}

function toggleStateButton(divBotão, state){
    console.log("toggle")
    if(state == 1){
        $(`#${divBotão} img`).attr('src', './img/turn-on.svg')
    } else {
        $(`#${divBotão} img`).attr('src', './img/turn-off.svg')
    }
}

function NotificationUI(text, type, autoHide){
	$.notify(text, {
		style:type,
		globalPosition:"bottom right",
		autoHide: autoHide,
	});

}

function getRotinasAndRender(){
    $('#rotinas').html("")
    $.getJSON({
        dataType: "json",
        url: "/rotinas",
        success: function(result) {
           ArrayRotinas = result;
           render(result)
        },
         error: function(event, jqxhr, exception) {
            console.log(event.responseText);
        }
    });

    function render(rotina){
        for(r of rotina){
            $('#rotinas').append(`
            <div id="${r._id}" onClick='editarRotina("${r._id}")' class="card card-rotina">
                <h3><strong>${r.hora}</strong></h3>
                <p>${r.name}</p>
            </div>`)
        }
            $('#rotinas').append(`<div id="addRotina" onClick='criarRotina()' class="card card-rotina">
            <img src="./img/icn-add.svg">
            <p>Criar Rotina</p>
        </div>`)
    }
}

function editarRotina(id){
    cancelarRotina();
    $.getJSON({
        dataType: "json",
        url: "/rotinas/" + id,
        success: function(result) {
            renderEditRotina(result)
        },
         error: function(event, jqxhr, exception) {
            console.log(event.responseText);
        }
    });

    function renderEditRotina(data){
        $(`#timepicker`).val(data[0].hora)
        for(pa of data[0].passos){
            if(pa[0] == "Delay"){
                $('#programarRotina').append(`
                <section id="r${routine+1}" class="row justify-content-center">
                    <div class="mb-4">
                    <div class="input-group is-invalid">
                        <div class="input-group-prepend">
                        <label class="input-group-text" for="validatedInputGroupSelect">Delay</label>
                        </div>
                        <input style="text-align: right;" type="text" class="form-control" placeholder="Tempo (ms)">
                        <div class="input-group-prepend">
                        <label class="input-group-text" for="validatedInputGroupSelect">ms</label>
                        </div>
                        <button onClick='excluirPasso("r${routine + 1}")' id="rem-r${routine + 1}" style="margin-right: 10px;" type="button" class="btn btn-secondary">X</button>
                    </div>
                    </div>
                </section>`)
                $(`#r${routine + 1} input`).val(pa[1])
            } else {
                $('#programarRotina').append(`
                <section id="r${routine + 1}" class="row justify-content-center">
                  <div class="mb-4">
                    <div class="input-group is-invalid">
                      <div class="input-group-prepend">
                          <label class="input-group-text" for="validatedInputGroupSelect">Alterar Estado</label>
                      </div>
                      <select class="custom-select dispositivo" id="validatedInputGroupSelect" required>
                          <option value="">Selecione o Dispositivo</option>
                          <option value="ledquarto">Quarto 1</option>
                          <option value="ledsala">Sala</option>
                          <option value="cortina">Cortina Quarto 1</option>
                          <option value="cafeteira">Cafeteira</option>
                          <option value="banheiro">Banheiro</option>
                      </select>
                      <select class="custom-select estado" id="validatedInputGroupSelect" required>
                          <option value="">Selecione o Estado</option><option value="0">Ligado</option>
                          <option value="1">Desligado</option>
                      </select>
                      <button onClick='excluirPasso("r${routine + 1}")' id="rem-r${routine + 1}" style="margin-right: 10px;" type="button" class="btn btn-secondary">X</button>
                    </div>
                  </div>
               </section>`)
               $(`#r${routine + 1} .dispositivo`).val(pa[1])
               $(`#r${routine + 1} .estado`).val(pa[2])
            }
            routine += 1
        }
        
        $("#idRotina").val(data[0]._id);
        $("#Excluir").removeAttr("disabled");
        $("#AddsRotinas").removeClass("hide");
        $("#programarRotina").removeClass("hide");
    }
}
function excluirRotina(){
    var err = {
        "_id":$("#idRotina").val(),
    }
    $.ajax({
        type: 'DELETE',
        url: '/rotinas',
        data: JSON.stringify(err),
        success: function(result){
            NotificationUI("Rotina excluida com sucesso", 'success', true)
            getRotinasAndRender()
        },
        error: function(event, jqxhr, exception) {
            console.log(event)
            if (event.status == 0){
                NotificationUI("Erro ao comunicar com servidor", 'error', true)
            } else if (event.status == 200){
                NotificationUI("Rotina excluida com sucesso", 'success', true)
                getRotinasAndRender()
            } else {
                NotificationUI(event.responseText, 'error', true)
            }
        },
        contentType: "application/json",
        dataType: 'json'
    })
}
function criarRotina(){
    $("#AddsRotinas").removeClass("hide");
    $("#programarRotina").removeClass("hide");
    $("#programarRotina").html(`<section id="hora" class="row justify-content-center">
    <div class="input-group-prepend">
        <label class="input-group-text" for="validatedInputGroupSelect">Hora para início</label>
      </div>
    <input class="time" id="timepicker" type="time">
</section>`);
    routine = 0;
    $("#Excluir").attr("disabled", "disabled");
}

function cancelarRotina(){
    $("#AddsRotinas").addClass("hide");
    $("#programarRotina").addClass("hide");
    $("#programarRotina").html(`<section id="hora" class="row justify-content-center">
    <div class="input-group-prepend">
        <label class="input-group-text" for="validatedInputGroupSelect">Hora para início</label>
      </div>
    <input class="time" id="timepicker" type="time">
</section>`);
    routine = 0;
}

function getNewRotina(){
    var rotina = {
        name:"",
        hora:"",
        passos:[]
    }
    $('#programarRotina section').each(function (indexInArray, element) { 
        console.log(element.id)
        if(element.id == 'hora'){
            rotina.hora = $(`#${element.id} #timepicker`).val()
        } else if ($(`#${element.id} label`).html() == 'Delay'){
            rotina.passos.push(["Delay", parseInt($(`#${element.id} input`).val())])
        } else if ($(`#${element.id} label`).html() == 'Alterar Estado'){
            rotina.passos.push(["Alterar Estado", $(`#${element.id} .dispositivo`).val(), $(`#${element.id} .estado`).val()])
        }

   });

   $.ajax({
    type: 'POST',
    url: '/rotinas',
    data: JSON.stringify(rotina),
    success: function(result){
        NotificationUI("Rotina criada com sucesso", 'success', true)
    },
    error: function(event, jqxhr, exception) {
    console.log(event)
    if (event.status == 0){
        NotificationUI("Erro ao comunicar com servidor", 'error', true)
    }
    NotificationUI(event.responseText, 'error', true)
    },
    contentType: "application/json",
    dataType: 'json'
});

   console.log(rotina)
}
function excluirPasso(passoDiv){
    console.log(passoDiv)
    $(`#${passoDiv}`).remove()
}
function sendMessage(msg, value){
    x = {"name":msg, "value":value}
    $.getJSON({
        dataType: "json",
        url: "/send/" + JSON.stringify(x),
        success: function(result) {
            updateimage(msg)
        },
         error: function(event, jqxhr, exception) {
            console.log(event.responseText);
        }
    });
}