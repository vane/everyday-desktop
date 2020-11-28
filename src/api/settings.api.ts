
export class SettingsVO {
  key: string
  value: string
}

export class SettingsKey {
  public static TIME_DISPLAY = 'TIME.DISPLAY'
}

export const settingsGet = async (key: string): Promise<SettingsVO|undefined> => {
  return new Promise((resolve, reject) => {
    window.perun.settingsGet({
      key: key,
    }, (msg) => {
      console.log('SETTINGS.GET', msg)
      resolve(msg.data)
    })
  })
}

export const settingsSet = async (key, value): Promise<void> => {
  return new Promise((resolve, reject) => {
    window.perun.settingsSet({
      key: key,
      value: value,
    }, (msg) => {
      console.log('SETTINGS.SET', msg)
      resolve(msg.data)
    })
  })
}
