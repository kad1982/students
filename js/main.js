(() => {
	const form = document.querySelector('.needs-validation');
	const firstName = document.getElementById('firstName');
	const lastName = document.getElementById('lastName');
	const patronymic = document.getElementById('patronymic');
	const dateOfBirth = document.getElementById('dateOfBirth');
	const yearBeginningTraining = document.getElementById('yearBeginningTraining');
	const faculty = document.getElementById('faculty');



	const student = [];

	function check(idTag) {
		const textError = document.querySelector('#' + idTag + '~.invalid-feedback');
		const input = document.querySelector('#' + idTag);

		let verificationРassed = false;

		function visibleError() {
			textError.style.display = 'block';
			input.classList.add('is-invalid');
			verificationРassed = false;
		}

		function closeError() {
			textError.style.display = 'none';
			if (input.classList.contains('is-invalid')) input.classList.remove('is-invalid');
			verificationРassed = true;

		}

		if (input.type === 'text')(input.value.trim() === '') ? visibleError() : closeError();
		else if (input.type === 'date')
			//от 01.01.1900 до текущей даты
			(input.value !== '' && new Date(input.value).getTime() <= new Date().getTime() && new Date(input.value).getTime() >= new Date('1990-01-01').getTime()) ? closeError() : visibleError();
		else if (input.type === 'number')
			//год начала обучения находится в диапазоне от 2000-го до текущего года
			(input.value !== '' && input.value <= new Date().getFullYear() && input.value >= 2000) ? closeError() : visibleError();
		return verificationРassed;
	}

	function age(date) {
		let now = new Date();
		let current_year = now.getFullYear();
		let year_diff = current_year - new Date(date).getFullYear();
		let birthday_this_year = new Date(current_year, new Date(date).getMonth(), new Date(date).getDate());
		return (now >= birthday_this_year) ?
			year_diff :
			year_diff - 1;

	}

	function createNewAttr(date) {
		for (const item of date) {
			item.age =
				new Date(item.dateOfBirth).getDate().toString().padStart(2, '0') + '.' + new Date(item.dateOfBirth).getMonth().toString().padStart(2, '0') + '.' + new Date(item.dateOfBirth).getFullYear() + ' (' + age(item.dateOfBirth) + ' лет)';
			item.fio = item.firstName + ' ' + item.lastName + ' ' + item.patronymic;
			item.lern = (new Date() > new Date((+item.yearBeginningTraining + 4).toString() + '-09-01')) ? item.yearBeginningTraining.toString() + '-' + (+item.yearBeginningTraining + 4).toString() + ' (закончил)' :

				item.yearBeginningTraining.toString() + '-' + (+item.yearBeginningTraining + 4).toString() +
				' (' +
				(new Date().getFullYear() - item.yearBeginningTraining) + ' курс)';
			item.lernStart = +item.yearBeginningTraining;
			item.lernEnd = +item.yearBeginningTraining + 4;

		}
	}

	function buildTable(data) {
		let table = document.getElementById('infoStudents');
		table.innerHTML = '';
		for (let i = 0; i < data.length; i++) {
			let row = `
				<tr class="table-info">
					<td>${data[i].fio}</td>
					<td>${data[i].faculty}</td>
					<td>${data[i].age}</td>
					<td>${data[i].lern}</td>					
				 </tr>`
			table.innerHTML += row
		}
	}

	function buildSortTable(data) {
		let table = document.getElementById('infoStudents');
		table.innerHTML = '';
		for (let i = 0; i < data.length; i++) {
			let row = data[i].innerHTML;
			table.innerHTML += row;
		}
	}

	form.addEventListener('submit', function (e) {
		// чтобы страница не перезагружалась при отправке формы
		e.preventDefault();
		const allInputEllement = document.querySelectorAll('.form-control');

		let text = '<hr>';
		document.querySelector('.all-text').innerHTML = '';
		for (const item of allInputEllement) {
			if (check(item.id) == false) text = text + document.querySelector('#' + item.id + '~.invalid-feedback').textContent + '<br>';
		}
		if (text !== '<hr>') {
			document.querySelector('.all-text').innerHTML = text;
			document.querySelector('.all-text').style.display = 'block';
		} else document.querySelector('.all-text').style.display = 'none';


		if (check('firstName') && check('lastName') && check('patronymic') && check('dateOfBirth') && check('yearBeginningTraining') && check('faculty')) {
			student.push({
				firstName: firstName.value,
				lastName: lastName.value,
				patronymic: patronymic.value,
				dateOfBirth: dateOfBirth.valueAsDate,
				// dateOfBirth: dateOfBirth.value,
				yearBeginningTraining: yearBeginningTraining.value,
				faculty: faculty.value
			})
			for (const item of allInputEllement) {
				item.value = '';
			}
		}
		createNewAttr(student)
		buildTable(student);
	})

	let btnFilter = document.getElementById('filter');


	btnFilter.addEventListener('click', function () {
		let inputFio = document.getElementById('txtFilterfio');
		let inputFac = document.getElementById('txtFilterfac');
		let inputStartLern = document.getElementById('txtFilterStartYear');
		let inputEndLern = document.getElementById('txtFilterEndYear');

		let arrFilter = [];
		for (const item of student) {
			arrFilter.push(item);
		}
		if (inputFio.value.trim() !== '') {
			arrFilter = arrFilter.filter(function (item) {
				return item.fio.toLowerCase().indexOf(inputFio.value.trim().toLowerCase()) !== -1
			});

		}
		if (inputFac.value.trim() !== '') {
			arrFilter = arrFilter.filter(function (item) {
				return item.faculty.toLocaleLowerCase().indexOf(inputFac.value.trim().toLowerCase()) !== -1
			});

		}
		if (inputStartLern.value !== '') {
			arrFilter = arrFilter.filter(function (item) {
				return item.lernStart === +inputStartLern.value;

			})
		}
		if (inputEndLern.value !== '') {
			arrFilter = arrFilter.filter(function (item) {
				return item.lernEnd === +inputEndLern.value;

			})
		}
		buildTable(arrFilter);
	})

	let tHeadTable = [...document.querySelectorAll("#table-infoStudents thead tr th")];
	for (const item of tHeadTable) {
		
		item.classList.add("ai_th_sortable");
		item.addEventListener('click', function () {
			let rowsTable = [...document.querySelectorAll("#table-infoStudents tbody tr")];
			if (!item.classList.contains('ai_th_sortable__down') && !item.classList.contains('ai_th_sortable__up')) item.classList.toggle("ai_th_sortable__down")
			else if (item.classList.contains('ai_th_sortable__down')) {
				item.classList.add("ai_th_sortable__up");
				item.classList.remove("ai_th_sortable__down");
			} else if (item.classList.contains('ai_th_sortable__up')) {
				item.classList.remove("ai_th_sortable__up");
				item.classList.add("ai_th_sortable__down");
			}
			let i = tHeadTable.indexOf(this);
			if (item.classList.contains('ai_th_sortable__down')) {
				if (item.classList.contains('sort_date')) {
					rowsTable.sort((a, b) => new Date(b.cells[i].textContent.split(' ')[0].split('.')[2], b.cells[i].textContent.split(' ')[0].split('.')[1] - 1, b.cells[i].textContent.split(' ')[0].split('.')[0]).getTime() -
						new Date(a.cells[i].textContent.split(' ')[0].split('.')[2], a.cells[i].textContent.split(' ')[0].split('.')[1] - 1, a.cells[i].textContent.split(' ')[0].split('.')[0]).getTime());
				} else if (item.classList.contains('sort_firstYear')) {
					rowsTable.sort((a, b) => a.cells[i].textContent.split('-')[0] - b.cells[i].textContent.split('-')[0])
				} else rowsTable.sort((a, b) => a.cells[i].textContent.localeCompare(b.cells[i].textContent));
			} else {
				if (item.classList.contains('sort_date')) {
					rowsTable.sort((a, b) => new Date(a.cells[i].textContent.split(' ')[0].split('.')[2], a.cells[i].textContent.split(' ')[0].split('.')[1] - 1, a.cells[i].textContent.split(' ')[0].split('.')[0]).getTime() -
						new Date(b.cells[i].textContent.split(' ')[0].split('.')[2], b.cells[i].textContent.split(' ')[0].split('.')[1] - 1, b.cells[i].textContent.split(' ')[0].split('.')[0]).getTime());
				} else if (item.classList.contains('sort_firstYear')) {
					rowsTable.sort((a, b) => b.cells[i].textContent.split('-')[0] - a.cells[i].textContent.split('-')[0])
				} else rowsTable.sort((a, b) => b.cells[i].textContent.localeCompare(a.cells[i].textContent));
			}
			buildSortTable(rowsTable);

		})
	}
})();