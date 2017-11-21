// 更新時にサーバーから受けとるタスクデータ
var taskData;
// 定数
const COMPLETED = '完了済み';
const INCOMPLETED = '未完了';
//ページネーションのオプション
var opt;
/*
 * タスクテーブルの描画
 */
function renderTaskTable(data) {
	// テーブルとページャーのリセット
	var $table = $('#task-table');
	$table.find('tr').remove(':not(:first-child)');
	var $pager = $('.pager');
	$pager.children().remove();

	$(data).each(function() {
		var task = this;
		var script = 'javascript:form' + task.id + '.submit()';
		var $taskNameAnchor = $('<a></a>').text(task.taskName)
		.attr('href', script)
		.addClass('task-name-anchor');
		var $form = $('<form></form>')
		.attr('name', 'form' + task.id)
		.attr('action', 'taskDetail')
		.attr('method', 'post');
		$hidden = $('<input>')
		.attr('name', 'taskId')
		.attr('type', 'hidden')
		.attr('value', task.id);
		$form
		.append($hidden)
		.append($taskNameAnchor);
		var $taskName = $('<td></td>').append($form);
		var $picName = $('<td></td>').text(task.picName);
		var $taskState = $('<td></td>').text(task.taskState);
		var $limitTime = $('<td></td>').text(task.limitTime);
		var $btns = createBtns(task);

		$('<tr></tr>')
		.addClass('pagination-data')
		.append($taskName)
		.append($picName)
		.append($taskState)
		.append($limitTime)
		.append($btns)
		.appendTo($table);
	});
}

function createBtns(task) {
	var taskId = task.id;
	var script1a = 'completeTaskWithoutST(' + taskId +  ')';
	var script1b = 'incompleteTaskWithoutST(' + taskId + ')';
	var script2 = 'renameTaskWithoutST(' + taskId + ')';
	var script3 = 'delteTaskWithoutST(' + taskId + ')';

	var ret = $('<td></td>');
	var ul = $('<ul></ul>').addClass('btns');
	var li1 = $('<li></li>');
	var btn1 = $('<button></button>').attr('type', 'button');
	if(task.taskState == INCOMPLETED) {
		btn1.html('完了<br>する').addClass('complete-btn').attr('onClick', script1a);
	}
	else {
		btn1.html('完了<br>取消').addClass('incomplete-btn').attr('onClick', script1b);
	}
	var li2 = $('<li></li>');
	var btn2 = $('<button></button>').html('名前<br>変更').addClass('edit-name-btn').attr('type', 'button').attr('onClick', script2);
	var li3 = $('<li></li>');
	var btn3 = $('<button></button>').html('削除<br>する').addClass('delete-btn').attr('type', 'button').attr('onClick', script3);

	li1.append(btn1);
	li2.append(btn2);
	li3.append(btn3);
	ul.append(li1).append(li2).append(li3);
	ret.append(ul);
	return ret;
}
/*
 * 画面遷移なしにタスクを完了する
 */
function completeTaskWithoutST(taskId) {
	console.log('completeTaskWithoutST');
	$.post('completeTaskWithoutST', {'taskId': taskId});
	$(taskData).each(function() {
		var task = this;
		if(task.id == taskId) {
			task.taskState = COMPLETED;
			return false;
		}
	});
	// タスクテーブルの再描画
	renderTaskTable(filterData(taskData, getValidFilterNames()));
	// ページネーション
	$('.pagination-data').pagination(opt);
}
/* 画面遷移なしにタスクの完了を取り消す */
function incompleteTaskWithoutST(taskId) {
	console.log('incompleteTaskWithoutST');
	$.post('incompleteTaskWithoutST', {'taskId': taskId});
	$(taskData).each(function() {
		var task = this;
		if(task.id == taskId) {
			task.taskState = INCOMPLETED;
			return false;
		}
	});
	// タスクテーブルの再描画
	renderTaskTable(filterData(taskData, getValidFilterNames()));
	// ページネーション
	$('.pagination-data').pagination(opt);
}
/* 画面遷移なしにタスク名を変更する */
function renameTaskWithoutST(taskId) {
	var result = prompt('新しい名前を入力してください。', '新しい名前');
	if(result) {
		console.log('renameTaskWithoutST: ' + result);
		$.post('renameTaskWithoutST', {'taskId': taskId, 'newName': result});
		$(taskData).each(function() {
			var task = this;
			if(task.id == taskId) {
				task.taskName = result;
				return false;
			}
		});
		// タスクテーブルの再描画
		renderTaskTable(filterData(taskData, getValidFilterNames()));
		// ページネーション
		$('.pagination-data').pagination(opt);
	}
}
/* 画面遷移なしにタスクを削除する */
function delteTaskWithoutST(taskId) {
	var result = confirm('本当に削除しますか？');
	if(result) {
		console.log('delteTaskWithoutST');
		$.post('deleteTaskWithoutST', {'taskId': taskId});
		$(taskData).each(function() {
			var task = this;
			if(task.id == taskId) {
				var i = taskData.indexOf(task);
				taskData.splice(i, 1);
				return false;
			}
		});
		// タスクテーブルの再描画
		renderTaskTable(filterData(taskData, getValidFilterNames()));
		// ページネーション
		$('.pagination-data').pagination(opt);
	}
}

function filterData(data, filterNames) {
	console.dir(data);
	var newData = new Set();
	$(filterNames).each(function() {
		var filterName = this.toString();
		switch(filterName) {
		case 'all':
			console.log('case all:');
			$(data).each(function() {
				var currentData = this;
				newData.add(currentData);
			});
			break;
		case 'incompleted':
			console.log('case incompleted:');
			$(data).each(function() {
				var currentData = this;
				if(currentData.taskState == INCOMPLETED) {
					newData.add(currentData);
				}
			});
			break;
		case 'completed':
			console.log('case completed:');
			$(data).each(function() {
				var currentData = this;
				if(currentData.taskState == COMPLETED) {
					newData.add(currentData);
				}
			});
			break;
		default:
			console.log('default');
			break;
		}
	});
	console.dir(newData);
	return Array.from(newData);
}
/*
 * 有効なフィルタ名の配列を取得する
 */
function getValidFilterNames() {
	var ret = [];
	$('ul.filter-btn').children().each(function() {
		var $child = this;
		if($($child).hasClass('on')) {
			ret.push($($child).attr('id'));
		}
	});
	console.dir(ret);
	return ret;
}
