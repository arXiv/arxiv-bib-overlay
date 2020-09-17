import { action, computed, observable } from 'mobx'
import { BibModel } from './BibModel'

export enum Status {
    LOADED = 'loaded',
    LOADING = 'loading',
    FAILED = 'failed',
    INIT = 'init'
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

    @action
    message(msg: string) {
        this.messages.push(msg)
    }

    @action
    error(err: any) {
        this.errors.push(err)
        this.state = Status.FAILED
    }
}

export const state: State = new State()
