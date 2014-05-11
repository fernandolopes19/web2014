var g_READER; //GLOBAL File Reader object for demo purpose only

/*
 * Verifica se suporta File API
 * @returns {Boolean}
 */
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        g_READER = new FileReader();
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}

/*
 * Lê o conteúdo do arquivo
 * @param {type} filePath
 * @returns {Boolean}
 */
function readText(filePath, id_area) {
    var output = ""; //placeholder for text output
    if (filePath.files && filePath.files[0]) {
        g_READER.onload = function(e) {
            output = e.target.result;
            displayContents(output, id_area);
        };//end onload()
        g_READER.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else if (ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            g_READER = new ActiveXObject("Scripting.FileSystemObject");
            var file = g_READER.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            displayContents(output, id_area);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                        'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                        'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
    return true;
}

/*
 * Mostra o arquivo selecionado em forma de texto
 * @param {type} txt
 * @param {type} id_area
 * @returns {undefined}
 */
function displayContents(txt, id_area) {
    var el = document.getElementById(id_area);
    el.innerHTML = txt; //display output in DOM
}

/*
 * Assina a mensagem (string)
 * @returns {undefined}
 */
function doSign() {
    var rsa = new RSAKey();
    rsa.readPrivateKeyFromPEMString(document.formulario.chavePrivada.value);
    var hashAlg = document.formulario.hash_algoritmo.value;
    var hSig = rsa.signString(document.formulario.campo_mensagem.value, hashAlg);
    document.formulario.campo_assinatura_digital.value = linebrk(hSig, 64);
}

/*
 * Verifica a autenticidade da Assinatura Digital
 */
function doVerify() {
    var sMsg = document.formulario.campo_mensagem_verificada.value;
    var hSig = document.formulario.campo_verificacao_assinatura_digital.value;

    var x509 = new X509();
    x509.readCertPEM(document.formulario.cert.value);
    var isValid = x509.subjectPublicKeyRSA.verifyString(sMsg, hSig);

    // display verification result
    if (isValid) {
        _displayStatus("valido");
    } else {
        _displayStatus("invalido");
    }
}

/*
 * Copia os campos da assinatura (string da mensagem, e assinatura digital) para
 * o campo da verificação da assinatura
 */
function copyMsgAndSig() {
    _displayStatus("reset");
    document.formulario.campo_mensagem_verificada.value = document.formulario.campo_mensagem.value;
    document.formulario.campo_verificacao_assinatura_digital.value = document.formulario.campo_assinatura_digital.value;
}

/*
 * Mostra se a Assinatura é válida ou não
 */
function _displayStatus(sStatus) {
    var div1 = document.getElementById("campo_resultado");
    if (sStatus === "valido") {
        div1.style.backgroundColor = "skyblue";
        div1.innerHTML = "Esta Assinatura Digital é válida.";
    } else if (sStatus === "invalido") {
        div1.style.backgroundColor = "deeppink";
        div1.innerHTML = "Esta Assinatura Digital não é válida.";
    } else {
        div1.style.backgroundColor = "yellow";
        div1.innerHTML = "Preencha os campos para realizar a verificação da Assinatura Digital";
    }
}