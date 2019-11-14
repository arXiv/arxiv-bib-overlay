import { action, computed, observable } from 'mobx'
import { cookies } from '../cookies'
import { BibModel } from './BibModel'

export enum Status {
    LOADED = 'loaded',
    LOADING = 'loading',
    FAILED = 'failed',
    INIT = 'init',
    DISABLED = 'disabled'
}

export class State {
    @observable
    bibmodel: BibModel = new BibModel()

    @observable
    messages: string[] = []

    @observable
    errors: any[] = []

    @observable
    state: Status = Status.INIT

    @computed
    get isfailed(): boolean {
        return this.state === Status.FAILED
    }

    @computed
    get isloaded(): boolean {
        return this.state === Status.LOADED
    }

    @computed
    get isloading(): boolean {
        return this.state === Status.LOADING
    }

    @computed
    get isdisabled(): boolean {
        return this.state === Status.DISABLED
    }

    @action
    init_from_cookies() {
        this.state = cookies.active ? Status.INIT : Status.DISABLED
    }

    @action
    toggle() {
        if (this.isdisabled) {
            this.state = Status.INIT
            this.bibmodel.reloadSource()
            cookies.active = true
        } else {
            this.state = Status.DISABLED
            cookies.active = false
        }
    }

    @action
    message(msg: string, exception: any = null) {
        this.messages.push(msg)
    }

    @action
    error(err: any, exception: any = null) {
        this.errors.push(err)
        this.state = Status.FAILED
    }
}

export const state: State = new State()
