import { Provider } from 'react-redux';
import store from '@edx/frontend-lib-content-components/editors/data/store';
import Gallery from './Gallery';


export const App = () => (
  <Provider store={store}>
    <div className="editor-gallery">
      <Gallery />
    </div>
  </Provider>
);
export default App;
