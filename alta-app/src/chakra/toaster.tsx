"use client"

import { createToaster } from "@chakra-ui/react"

export const toaster = createToaster({
  placement: 'bottom-end',
  duration: 5000,
  pauseOnPageIdle: true,
});
