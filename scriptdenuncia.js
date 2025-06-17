document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("denunciaForm");
  const checkboxAnonima = document.getElementById("anonima");
  const contatoSection = document.getElementById("contato");
  const fotosInput = document.getElementById("fotos");

  checkboxAnonima.addEventListener("change", () => {
    contatoSection.style.display = checkboxAnonima.checked ? "none" : "block";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fotos = fotosInput.files;
    if (fotos.length > 5) {
      alert("Você só pode enviar no máximo 5 fotos.");
      return;
    }

    let numeroProtocolo = parseInt(localStorage.getItem("ultimoProtocolo") || "0", 10);
    if (numeroProtocolo >= 500) {
      alert("Limite de denúncias atingido (500).");
      return;
    }
    numeroProtocolo += 1;
    const protocoloFormatado = numeroProtocolo.toString().padStart(3, '0');
    localStorage.setItem("ultimoProtocolo", numeroProtocolo);
    localStorage.setItem("protocoloAtual", protocoloFormatado);

    const formData = new FormData();
    formData.append("nomeUsuario", checkboxAnonima.checked ? "" : form.nome.value);
    formData.append("email", checkboxAnonima.checked ? "" : form.email.value);
    formData.append("telefoneUsuario", checkboxAnonima.checked ? "" : form.telefone.value);
    formData.append("tituloDenuncia", form.titulo.value);
    formData.append("categoriaDenuncia", form.categoria.value);
    formData.append("descricaoDenuncia", form.descricao.value);
    formData.append("enderecoDenuncia", form.endereco.value);
    formData.append("denunciaAnonima", checkboxAnonima.checked);

    // Anexar fotos ao FormData
    for (let i = 0; i < fotos.length; i++) {
      formData.append("fotos", fotos[i]);
    }

    fetch("/denuncias", {
      method: "POST",
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao enviar denúncia");
      return res.json();
    })
    .then(() => {
      window.location.href = "sucesso.html";
    })
    .catch(err => {
      alert("Falha no envio: " + err.message);
    });
  });
});
