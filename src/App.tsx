import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { AppBootstrap } from "./modules/app/components/AppBootstrap";
import { AuthBootstrap } from "./modules/auth/components/AuthBootstrap";
import AppRouter from "./modules/common/utils/AppRouter";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter>
        <AuthBootstrap />
        <AppBootstrap />
        <Toaster position="top-right" />
        <AppRouter.Routes />
      </AppRouter>
    </Provider>
  );
};

export default App;
