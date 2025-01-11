import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Box, BoxProps } from 'ink';

function useStdoutDimensions(): [number, number] {
  const { columns, rows } = process.stdout;
  const [size, setSize] = useState({ columns, rows });
  useEffect(() => {
    function onResize() {
      const { columns, rows } = process.stdout;
      setSize({ columns, rows });
    }
    process.stdout.on("resize", onResize);
    return () => {
      process.stdout.off("resize", onResize);
    };
  }, []);
  return [size.columns, size.rows];
}

// https://github.com/vadimdemedes/ink/issues/263#issuecomment-1926026985
export const FullScreen: React.FC<PropsWithChildren<BoxProps>> = ({ children, ...styles }) => {
  const [columns, rows] = useStdoutDimensions();
  return <Box width={columns} height={rows} {...styles}>{children}</Box>;
}