import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import AppRouter from "./modules/common/utils/AppRouter";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter>
        <Toaster position="top-right" />
      </AppRouter>
    </Provider>
  );
};

export default App;
