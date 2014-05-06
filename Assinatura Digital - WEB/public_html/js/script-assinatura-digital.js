function hash() {
    var md = new KJUR.crypto.MessageDigest({"alg": "sha1", "prov": "cryptojs"});
    md.updateString('aaa');
    var mdHex = md.digest();

    var logid = document.getElementById("area");
    var corrente = logid.innerHTML + mdHex;
    logid.innerHTML = corrente + "<br />";
}