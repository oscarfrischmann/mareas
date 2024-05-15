const formData = document.getElementById('formData');
formData.addEventListener('submit', calculate);
const datosCalculados = document.getElementById('datosCalculados');
const boton = document.getElementsByTagName('button');

function animar() {
	boton[0].style.backgroundColor = 'green';
	setTimeout(() => {
		boton[0].style.backgroundColor = 'blue';
	}, 1000);
	datosCalculados.classList.toggle('animate__fadeIn');
}

function calculate(e) {
	e.preventDefault();
	const caladoMts = Number(formData['caladoMts'].value);
	const caladoCms = Number(formData['caladoCms'].value);
	const margen = Number(formData['margenSeguridad'].value);
	const profundidad = Number(formData['profundidad'].value);
	const mareaMeteo = Number(formData['mareaMeteo'].value);
	let mareaUno = formData['mareaUno'].value;
	let mareaDos = formData['mareaDos'].value;
	const alturaUnoMts = Number(formData['alturaUnoMts'].value);
	const alturaUnoCms = Number(formData['alturaUnoCms'].value);
	const alturaDosMts = Number(formData['alturaDosMts'].value);
	const alturaDosCms = Number(formData['alturaDosCms'].value);

	const data = {
		caladoMts: caladoMts,
		caladoCms: caladoCms,
		margen: margen,
		profundidad: profundidad,
		mareaMeteo: mareaMeteo / 100,
		mareaUnoHora: Number(mareaUno[0] + mareaUno[1]),
		mareaUnoMinutos: Number(mareaUno[3] + mareaUno[4]),
		mareaDosHora: Number(mareaDos[0] + mareaDos[1]),
		mareaDosMinutos: Number(mareaDos[3] + mareaDos[4]),
		alturaUnoMts: alturaUnoMts,
		alturaUnoCms: alturaUnoCms,
		alturaDosMts: alturaDosMts,
		alturaDosCms: alturaDosCms,
	};
	const sondajeRequerido = data.caladoMts + data.caladoCms / 100 + data.margen / 100;
	const diferenciaMareaDecimal =
		(data.mareaDosMinutos - data.mareaUnoMinutos + (data.mareaDosHora - data.mareaUnoHora) * 60) / 60;
	const diferenciaMareaMin = Number(((diferenciaMareaDecimal - Math.floor(diferenciaMareaDecimal)) * 60).toFixed(0));
	const diferenciaMareaHora = Math.floor(diferenciaMareaDecimal);
	const diferenciaMarea = Math.round((diferenciaMareaHora * 60 + diferenciaMareaMin) / 6);

	const horasMarea = [];
	let flagTime = 0;
	let hora1 = data.mareaUnoHora * 60 + data.mareaUnoMinutos;
	for (let i = 1; i < 7; i++) {
		flagTime += diferenciaMarea;
		let horas = flagTime + hora1;
		horasMarea.push(horas);
	}
	const horasString = [];
	horasMarea.forEach((h) => {
		horasString.push(`${Math.floor(h / 60)}:${(h % 60 < 10 ? '0' : '') + (h % 60)}`);
	});

	const alturaUno = data.alturaUnoMts * 100 + data.alturaUnoCms;
	const alturaDos = data.alturaDosMts * 100 + data.alturaDosCms;
	const amplitud =
		alturaUno < alturaDos ? ((alturaDos - alturaUno) / 12).toFixed(2) : ((alturaUno - alturaDos) / 12).toFixed(2);
	const amplitudMareas = Math.round(parseFloat(amplitud));
	const profundidadEfectiva = alturaUno + profundidad + mareaMeteo;
	console.log(profundidadEfectiva);
	const ampMar = [];
	let flagMar = 0;
	for (let i = 1; i < 7; i++) {
		if (alturaUno > alturaDos) {
			switch (i) {
				case 1:
					ampMar.push((flagMar = profundidadEfectiva - amplitudMareas));
					break;

				case 2:
					ampMar.push((flagMar = flagMar - amplitudMareas * 2));
					break;

				case 3:
					ampMar.push((flagMar = flagMar - amplitudMareas * 3));
					break;

				case 4:
					ampMar.push((flagMar = flagMar - amplitudMareas * 3));
					break;

				case 5:
					ampMar.push((flagMar = flagMar - amplitudMareas * 2));
					break;

				case 6:
					ampMar.push((flagMar = flagMar - amplitudMareas));
					break;
			}
		} else {
			switch (i) {
				case 1:
					ampMar.push((flagMar = profundidadEfectiva + amplitudMareas));
					break;

				case 2:
					ampMar.push((flagMar = flagMar + amplitudMareas * 2));
					break;

				case 3:
					ampMar.push((flagMar = flagMar + amplitudMareas * 3));
					break;

				case 4:
					ampMar.push((flagMar = flagMar + amplitudMareas * 3));
					break;

				case 5:
					ampMar.push((flagMar = flagMar + amplitudMareas * 2));
					break;

				case 6:
					ampMar.push((flagMar = flagMar + amplitudMareas));
					break;
			}
		}
	}
	console.log(ampMar);

	datosCalculados.innerHTML = `
  <div class="datosCalculados">
    <span>Sondaje requerido: ${sondajeRequerido} mts</span>
    <span>Profundidad: ${data.profundidad} cms</span>
    <span>Diferencia de marea/6: ${diferenciaMarea}</span>
    <span>Amplitud de marea/12 = ${amplitudMareas} cms</span>
  </div>

    <table>
    <tr>
      <th>Período</th>
      <th>Hora</th>
      <th>Altura</th>
    </tr>
    <tr>
      <td>0</td>
      <td>${mareaUno}</td>
      <td>${(profundidadEfectiva / 100).toFixed(2)} mts</td>
    </tr>
      <tr>
        <td>1</td>
        <td>${horasString[0]}</td>
        <td>${ampMar[0] / 100} mts</td>
      </tr>
      <tr>
        <td>2</td>
        <td>${horasString[1]}</td>
        <td>${ampMar[1] / 100} mts</td>
      </tr>
        <td>3</td>
        <td>${horasString[2]}</td>
        <td>${ampMar[2] / 100} mts</td>
      </tr>
      <tr>
        <td>4</td>
        <td>${horasString[3]}</td>
        <td>${ampMar[3] / 100} mts</td>
      </tr>
        <td>5</td>
        <td>${horasString[4]}</td>
        <td>${ampMar[4] / 100} mts</td>
      </tr>
      <tr>
        <td>6</td>
        <td>${horasString[5]}</td>
        <td>${ampMar[5] / 100} mts</td>
      </tr>
    </table>

  `;
}
