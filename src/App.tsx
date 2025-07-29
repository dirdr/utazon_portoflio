import { AppWrapper } from "./component/app/AppWrapper";
import { AppWithDiveIn } from "./component/app/AppWithDiveIn";
import { VideoProvider } from "./contexts/VideoContext";
import { AppStateProvider } from "./contexts/AppStateContext";
import "./index.css";

function App() {
  return (
    <AppStateProvider>
      <AppWrapper>
        <VideoProvider>
          <AppWithDiveIn />
        </VideoProvider>
      </AppWrapper>
    </AppStateProvider>
  );
}

export default App;
