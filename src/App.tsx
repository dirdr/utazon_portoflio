import { AppWrapper } from "./component/app/AppWrapper";
import { AppWithDiveIn } from "./component/app/AppWithDiveIn";
import { VideoProvider } from "./contexts/VideoContext";
import "./index.css";

function App() {
  return (
    <AppWrapper>
      <VideoProvider>
        <AppWithDiveIn />
      </VideoProvider>
    </AppWrapper>
  );
}

export default App;
