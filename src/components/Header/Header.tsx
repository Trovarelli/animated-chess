import { useContext } from "react";
import { GameContext } from "@/context";

export const Header = () => {
  const context = useContext(GameContext);
  
  return (
    <div style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
      Header Test. Context status: {context ? 'Available' : 'NULL'}
    </div>
  );
};
