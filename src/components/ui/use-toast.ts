"use client";

import * as React from "react";

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  open?: boolean;
};

type State = {
  toasts: ToastProps[];
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 3000;

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: any) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };

    default:
      return state;
  }
}

export function toast(props: Omit<ToastProps, "id">) {
  const id = Math.random().toString(36).slice(2);

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // ✅ IMPORTANT
    },
  });

  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", id });
  }, TOAST_REMOVE_DELAY);
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toast,
    toasts: state.toasts,
  };
}
