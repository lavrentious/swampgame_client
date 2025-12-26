import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { AuthBootstrap } from "./modules/common/components/AuthBootstrap";
import AppRouter from "./modules/common/utils/AppRouter";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter>
        <AuthBootstrap />
        <Toaster position="top-right" />
      </AppRouter>
    </Provider>
  );
};

export default App;
