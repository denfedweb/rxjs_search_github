import {EMPTY, fromEvent} from "rxjs"
import {map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap, catchError, filter} from "rxjs/operators"
import {ajax} from "rxjs/ajax"

const url = 'https://api.github.com/search/users?q=';

const search = document.getElementById('search');

const stream$ = fromEvent(search, 'input')
.pipe(
  map(e => e.target.value), // ВОЗВРАТ ОПРЕДЛЕННОГО ЗНАЧЕНИЯ, ФОРМИРУЕМ НОВЫЙ МАССИВ
  debounceTime(500),  //ЗАДЕРЖКА
  distinctUntilChanged(), //НЕ ПОВТОРЯЕТ ЗАПРОС ПРИ ТЕХ ЖЕ ВХОДНЫХ ДАННЫХ
  tap(() => result.innerHTML = ''), //ЧИСТИТ БЛОК ПРИ НОВОМ ЗАПРОСЕ
  filter(v => v.trim()), //ПРОВЕРЯЕТ ЧТО БЫ ЗНАЧЕНИЕ НЕ БЫЛО ПУСТЫМ
  switchMap(v => ajax.getJSON(`${url}${v}`).pipe( //НОВЫЙ СТРИМ
    catchError(err => EMPTY) //если поле пустое предотвращаем ошибку
  )),
  map(res => res.items), //ВОЗВРАТ ОПРЕДЛЕННОГО ЗНАЧЕНИЯ, ФОРМИРУЕМ НОВЫЙ МАССИВ
  mergeMap(items => items) //ПОЛУЧАЕТ ПО ОТДЕЛЬНОМУ ЭЛЕМЕНТУ
  );

const searchSub = stream$.subscribe(value => {
    result.insertAdjacentHTML('beforeend', `
    <div class="card">
        <div class="card-image">
          <img src=${value.avatar_url}>
          <span class="caed-title">${value.login}</span>
        </div>
        <div class="card-action">
          <a href=${value.html_url} target="_blank">Github profile</a>
        </div>
      </div>
    `)
  })

unsub.onclick = () => {
  searchSub.unsubscribe();
  alert('Stream unsubscribed!');
};  