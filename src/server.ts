import { App } from "@/app";
import { ValidateEnv } from "@utils/validateEnv";

import { AuthRoute } from "@routes/auth.routes";
import { UserRoute } from "@routes/users.routes";
import { AccountRoute } from "@routes/account.routes";
import { FileRoute } from "@routes/files.routes";

import { ArticleRoute } from "@routes/articles.routes";
import { CategoryRoute } from "./routes/categories.routes";

ValidateEnv();

const app = new App([
  new AuthRoute(), 
  new UserRoute(),
  new AccountRoute(),
  new FileRoute(),

  new ArticleRoute(),
  new CategoryRoute()
]);

app.listen();