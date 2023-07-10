currentDate = new Date();
currentYear = currentDate.getFullYear();
currentMonth = currentDate.getMonth() + 1;

function generateCalendar(year, month,objData = null)
{
	month -= 1;
	let calendarHTML = '';

	// 月の最初の日の取得
	const firstDay = new Date(year, month, 1);

	// 月の最後の日の取得
	const lastDay = new Date(year, month + 1, 0);

	// 先頭に年と月を表示
	calendarHTML += `<p>${year}年 ${month + 1}月</p>`;

	// テーブルの開始タグ
	calendarHTML += '<table border="3">';

	// 曜日の配列
	const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

	// 曜日のヘッダー行
	calendarHTML += '<tr>';
	for (let i = 0; i < weekdays.length; i++) {
		calendarHTML += `<th>${weekdays[i]}</th>`;
	}
	calendarHTML += '</tr>';

	// カレンダーの日付を埋める
	let dayCount = 1;
	let rowCount = 0;

	// 先月の最後の日の取得
	const prevMonthLastDay = new Date(year, month, 0).getDate();

	// 先月の日付を埋める
	const firstDayOfWeek = firstDay.getDay(); // 先月の最初の曜日

	for (let i = prevMonthLastDay - firstDayOfWeek + 1; i <= prevMonthLastDay; i++) {
		calendarHTML += `<td class="prev-month">${i}</td>`;
		rowCount++;
	}

	while (dayCount <= lastDay.getDate()) {
		if (rowCount === 0) {
			calendarHTML += '<tr>';
		}

		let newDate;

		if(objData){
			newDate = `${('0000' + currentYear).slice(-4)}-${('00' + currentMonth).slice(-2)}-${('00' + dayCount).slice(-2)}`;
		}

		// 現在の月の日を表示
		if(currentDate.getFullYear()==year&&currentDate.getMonth()==month&&currentDate.getDate()==dayCount)
		{
			if(objData&&objData[newDate]){
				calendarHTML += `<td bgcolor="yellow"><font color="orange">${dayCount}<br>${objData[newDate]}</font></td>`;
			}else
			{
				calendarHTML += `<td bgcolor="yellow">${dayCount}</td>`
			}
		}
		else if (objData&&objData[newDate]) {
			calendarHTML += `<td><font color="orange">${dayCount}<br>${objData[newDate]}</font></td>`;
		} else {
			calendarHTML += `<td>${dayCount}</td>`;
		}

		dayCount++;
		rowCount++;

		if (rowCount === 7) {
			calendarHTML += '</tr>';
			rowCount = 0;
		}
	}

	// 次月の日付を埋める
	if (rowCount > 0) {
		const daysToAdd = 7 - rowCount;
		for (let i = 1; i <= daysToAdd; i++) {
			calendarHTML += `<td class="next-month">${i}</td>`;
			rowCount++;
		}
	}

	calendarHTML += '</table>';

	// カレンダー要素にHTMLを挿入
	document.querySelector('#calendar').innerHTML = calendarHTML;
}

function generateCalendarWithHolidays(year, month) {

	let objData;
	// XMLHttpRequestオブジェクトの作成
	var request = new XMLHttpRequest();

	// URLを開く
	request.open('GET', `https://holidays-jp.github.io/api/v1/${currentYear}/date.json`, true);

	// レスポンスが返ってきた時の処理を記述 
	request.onload = function () {
		var data = this.response;

		objData = JSON.parse(data);
		
		generateCalendar(year,month,objData)
	}

	// リクエストをURLに送信
	request.send();
}

if(currentYear>=2025||currentYear<=2014)
{
	generateCalendar(currentYear, currentMonth);
}else
{
	generateCalendarWithHolidays(currentYear, currentMonth);
}


function NextButton() {
	currentMonth += 1;

	if (currentMonth > 12) {
		currentYear++;
		currentMonth = 1;
	}

	if(currentYear>=2025||currentYear<=2014)
	{
		generateCalendar(currentYear, currentMonth);
	}else
	{
		generateCalendarWithHolidays(currentYear, currentMonth);
	}
}

function PrevButton() {
	currentMonth -= 1;

	if (currentMonth < 1) {
		currentYear--;
		currentMonth = 12;
	}

	if(currentYear>=2025||currentYear<=2014)
	{
		generateCalendar(currentYear, currentMonth);
	}else
	{
		generateCalendarWithHolidays(currentYear, currentMonth);
	}
}

//日本の祝日の取得にはhttps://holidays-jp.github.io/を使用した。