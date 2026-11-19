(function () {
  var KEY = "papan-tugas-v1";
  var tugas = [];
  var filter = "semua";

  function muat() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(data)) tugas = data;
    } catch (e) {}
    if (tugas.length === 0) {
      tugas = [
        { id: 1, teks: "Coba centang tugas ini", selesai: false },
        { id: 2, teks: "Tambahkan tugas pertamamu", selesai: false }
      ];
    }
  }
  function simpan() {
    try { localStorage.setItem(KEY, JSON.stringify(tugas)); } catch (e) {}
  }

  var daftar = document.getElementById("daftar");
  var input = document.getElementById("input");

  function gambar() {
    var tampil = tugas.filter(function (t) {
      if (filter === "aktif") return !t.selesai;
      if (filter === "selesai") return t.selesai;
      return true;
    });
    daftar.innerHTML = "";
    if (tampil.length === 0) {
      var kosong = document.createElement("li");
      kosong.className = "empty";
      kosong.style.display = "block";
      kosong.textContent = filter === "semua"
        ? "Belum ada tugas. Tulis satu di kolom atas."
        : "Tidak ada tugas di daftar ini.";
      daftar.appendChild(kosong);
    }
    tampil.forEach(function (t) {
      var li = document.createElement("li");
      if (t.selesai) li.className = "done";

      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = t.selesai; cb.id = "t" + t.id;
      cb.addEventListener("change", function () { t.selesai = cb.checked; simpan(); gambar(); });

      var lb = document.createElement("label");
      lb.htmlFor = cb.id; lb.textContent = t.teks;

      var del = document.createElement("button");
      del.className = "del"; del.type = "button"; del.textContent = "×";
      del.setAttribute("aria-label", "Hapus tugas: " + t.teks);
      del.addEventListener("click", function () {
        tugas = tugas.filter(function (x) { return x.id !== t.id; });
        simpan(); gambar();
      });

      li.appendChild(cb); li.appendChild(lb); li.appendChild(del);
      daftar.appendChild(li);
    });

    var total = tugas.length;
    var beres = tugas.filter(function (t) { return t.selesai; }).length;
    var persen = total ? Math.round(beres / total * 100) : 0;
    document.getElementById("ringkas").textContent = beres + " dari " + total + " selesai";
    document.getElementById("persen").textContent = persen + "%";
    document.getElementById("fill").style.width = persen + "%";
  }

  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var teks = input.value.trim();
    if (!teks) { input.focus(); return; }
    tugas.unshift({ id: Date.now(), teks: teks, selesai: false });
    input.value = "";
    simpan(); gambar(); input.focus();
  });

  document.getElementById("filters").addEventListener("click", function (e) {
    var f = e.target.getAttribute("data-f");
    if (!f) return;
    filter = f;
    Array.prototype.forEach.call(this.children, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-f") === f));
    });
    gambar();
  });

  document.getElementById("hapusSelesai").addEventListener("click", function () {
    tugas = tugas.filter(function (t) { return !t.selesai; });
    simpan(); gambar();
  });

  document.getElementById("tema").addEventListener("click", function () {
    var root = document.documentElement;
    var gelap = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.setAttribute("data-theme", gelap ? "light" : "dark");
  });

  document.getElementById("tanggal").textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  muat();
  gambar();
})();
