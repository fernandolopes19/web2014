function doSign() {
    var rsa = new RSAKey();
    rsa.readPrivateKeyFromPEMString(document.formulario.chavePrivada.value);
    var hashAlg = document.formulario.hash_algoritmo.value;
    var hSig = rsa.signString(document.formulario.campo_mensagem.value, hashAlg);
    document.formulario.campo_assinatura_digital.value = linebrk(hSig, 64);
}

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

function copyMsgAndSig() {
    _displayStatus("reset");
    document.formulario.campo_mensagem_verificada.value = document.formulario.campo_mensagem.value;
    document.formulario.campo_verificacao_assinatura_digital.value = document.formulario.campo_assinatura_digital.value;
}

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