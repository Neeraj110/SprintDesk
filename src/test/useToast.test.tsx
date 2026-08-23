import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { ToastProvider, useToast } from "../components/ui/Toast";

describe("useToast Hook", () => {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  it("should initialize with an empty toasts list", () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    expect(result.current.toasts).toEqual([]);
  });

  it("should add a toast and return a generated id", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({
        title: "Test Toast",
        message: "This is a test notification",
        type: "success",
        duration: 0,
      });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe("Test Toast");
    expect(result.current.toasts[0].type).toBe("success");
  });

  it("should remove a toast by id", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    let toastId: string = "";
    act(() => {
      toastId = result.current.addToast({
        message: "Toast to remove",
        type: "info",
        duration: 0,
      });
    });

    expect(result.current.toasts.length).toBe(1);

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts.length).toBe(0);
  });

  it("should clear all toasts", () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast({ message: "Toast 1", type: "info", duration: 0 });
      result.current.addToast({ message: "Toast 2", type: "warning", duration: 0 });
    });

    expect(result.current.toasts.length).toBe(2);

    act(() => {
      result.current.clearToasts();
    });

    expect(result.current.toasts.length).toBe(0);
  });
});
