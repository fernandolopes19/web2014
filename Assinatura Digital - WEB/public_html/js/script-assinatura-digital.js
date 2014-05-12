var g_READER;

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
function readText(filePath, idArea) {
    var txtChave = "";
    if (filePath.files && filePath.files[0]) {
        g_READER.onload = function(e) {
            txtChave = e.target.result;
            displayContents(txtChave, idArea);
        };
        g_READER.readAsText(filePath.files[0]);
    }
    else if (ActiveXObject && filePath) {
        try {
            g_READER = new ActiveXObject("Scripting.FileSystemObject");
            var file = g_READER.OpenTextFile(filePath, 1); //ActiveX File Object
            txtChave = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            displayContents(txtChave, idArea);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                        'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                        'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    }
    else {
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
function displayContents(txtChave, idArea) {
    var elemento = document.getElementById(idArea);
    elemento.innerHTML = txtChave;
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

    if (isValid) {
        displayStatus("valido");
    } else {
        displayStatus("invalido");
    }
}

/*
 * Copia os campos da assinatura (string da mensagem, e assinatura digital) para
 * o campo da verificação da assinatura
 */
function copyMsgAndSig() {
    displayStatus("reset");
    document.formulario.campo_mensagem_verificada.value = document.formulario.campo_mensagem.value;
    document.formulario.campo_verificacao_assinatura_digital.value = document.formulario.campo_assinatura_digital.value;
}

/*
 * Mostra se a Assinatura é válida ou não
 */
function displayStatus(status) {
    var div1 = document.getElementById("campo_resultado");
    if (status === "valido") {
        div1.style.backgroundColor = "skyblue";
        div1.innerHTML = "Esta Assinatura Digital é válida.";
    } else if (status === "invalido") {
        div1.style.backgroundColor = "deeppink";
        div1.innerHTML = "Esta Assinatura Digital não é válida.";
    } else {
        div1.style.backgroundColor = "yellow";
        div1.innerHTML = "Preencha os campos para realizar a verificação da Assinatura Digital";
    }
}