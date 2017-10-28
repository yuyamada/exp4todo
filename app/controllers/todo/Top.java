package controllers.todo;

import models.todo.consts.Consts;
import models.todo.entity.User;
import play.mvc.Controller;

public class Top extends Controller {

	/**
	 * TOPページ
	 */
	public static void index() {
		if(!session.contains(Consts.LOGIN)) {
			flash.put(Consts.ERRMSG, "アクセスにはログインが必要です。");
			Login.index();
		}
		User user = User.find("uid = ?1", session.get(Consts.LOGIN)).first();
		renderArgs.put("user", user);
		render();
	}
}