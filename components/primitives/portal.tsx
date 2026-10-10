import * as React from "react"

const DEFAULT_PORTAL_HOST = "INTERNAL_PRIMITIVE_DEFAULT_HOST_NAME"

type PortalEntries = ReadonlyMap<string, React.ReactNode>

const EMPTY_ENTRIES: PortalEntries = new Map()

let hosts: ReadonlyMap<string, PortalEntries> = new Map()
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getEntries(hostName: string): PortalEntries {
  return hosts.get(hostName) ?? EMPTY_ENTRIES
}

function mountPortal(
  hostName: string,
  name: string,
  children: React.ReactNode
) {
  const entries = new Map(getEntries(hostName))
  entries.set(name, children)
  hosts = new Map(hosts).set(hostName, entries)
  emit()
}

function unmountPortal(hostName: string, name: string) {
  const current = getEntries(hostName)
  if (!current.has(name)) return
  const entries = new Map(current)
  entries.delete(name)
  const nextHosts = new Map(hosts)
  if (entries.size === 0) nextHosts.delete(hostName)
  else nextHosts.set(hostName, entries)
  hosts = nextHosts
  emit()
}

function usePortalEntries(hostName: string) {
  const getSnapshot = React.useCallback(() => getEntries(hostName), [hostName])
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

interface PortalHostProps {
  name?: string
}

function PortalHost({ name = DEFAULT_PORTAL_HOST }: PortalHostProps) {
  const entries = usePortalEntries(name)
  if (entries.size === 0) return null
  return (
    <>
      {Array.from(entries, ([portalName, children]) => (
        <React.Fragment key={portalName}>{children}</React.Fragment>
      ))}
    </>
  )
}

interface PortalProps {
  name: string
  hostName?: string
  children: React.ReactNode
}

function Portal({
  name,
  hostName = DEFAULT_PORTAL_HOST,
  children,
}: PortalProps) {
  React.useEffect(() => {
    mountPortal(hostName, name, children)
  }, [hostName, name, children])

  React.useEffect(() => {
    return () => unmountPortal(hostName, name)
  }, [hostName, name])

  return null
}

export type { PortalHostProps, PortalProps }
export { DEFAULT_PORTAL_HOST, Portal, PortalHost }
