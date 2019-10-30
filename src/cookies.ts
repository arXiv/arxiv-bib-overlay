import * as Cookie from 'js-cookie'
import * as CONFIG from './bib_config'

const enum COOKIE_NAMES {
    ACTIVE = 'active'
}

class Cookies {
    localCookies = Cookie

    dsname(name: string) {
        // convert datasource to cookie name
        return `ds_${name.toLowerCase()}`
    }

    get_json() {
        const txtjson = this.localCookies.get(CONFIG.POLICY_COOKIE_NAME)
        if (!txtjson) {
            return {}
        }

        try {
            return JSON.parse(txtjson)
        } catch (e) {
            return {}
        }
    }

    get_value(name: string) {
        return this.get_json()[name]
    }

    set_value(name: string, value: any) {
        const json = this.get_json()
        json[name] = value

        const attr = {expires: CONFIG.POLICY_COOKIE_EXPIRATION}
        this.localCookies.set(CONFIG.POLICY_COOKIE_NAME, JSON.stringify(json), attr)
    }

    get_boolean(name: string, default_value: boolean) {
        let value = this.get_value(name)

        if (value === undefined || value === null) {
            value = default_value
        }

        if (value === 'true') { value = true }
        if (value === 'false') { value = false }

        this.set_value(name, value)
        return value
    }

    set_boolean(name: string, value: boolean) {
        this.set_value(name, value) 
    }

    set active(active: boolean) {
        this.set_boolean(COOKIE_NAMES.ACTIVE, active)
    }

    get active(): boolean {
        return this.get_boolean(COOKIE_NAMES.ACTIVE, CONFIG.POLICY_DEFAULT_ENABLED)
    }

    get_datasource(category: string): string {
        if (!CONFIG.POLICY_REMEMBER_DATASOURCE) {
            return ''
        }

        const val = this.get_value(this.dsname(category))
        return val || ''
    }

    set_datasource(category: string, value: string) {
        if (!CONFIG.POLICY_REMEMBER_DATASOURCE) {
            return
        }

        this.set_value(this.dsname(category), value)
    }
}

export const cookies: Cookies = new Cookies()
