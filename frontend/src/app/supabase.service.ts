import { Time } from '@angular/common';
import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'environment'
import { Timestamp } from 'rxjs';

export interface Todo {
  id?: string;
  title: string;
  is_complete: boolean;
  user_id?: string;
  created_at?: Time;
  work_duration?: number;
  due_date?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null
  private _user: User | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    this.loadUser();
  }

  async getSession(): Promise<AuthSession | null> {
    const { data } = await this.supabase.auth.getSession();
    this._session = data.session;
    return this._session;
  }

  async loadUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    this._user = data?.user || null;
    return this._user;
  }

  get user() {
    return this._user;
  }


  authChanges(callback: (event: AuthChangeEvent, session: AuthSession | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      this._session = session;
      this._user = session?.user || null;   
      callback(event, session);
    });
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password })
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  async getTodos() {
    const user = await this.user;
    console.log(user);
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async addTodo(todo: Partial<Todo>) {
    const { data, error } = await this.supabase
      .from('todos')
      .insert([{ ...todo, user_id: this._session?.user?.id }]);
  
    if (error) throw error;
    return data;
  }

  async updateTodo(id: string, updates: Partial<Todo>) {
    const { data, error } = await this.supabase
      .from('todos')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  async deleteTodo(id: string) {
    const { data, error } = await this.supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  async saveTimerData(userId: string, time: number): Promise<void> {
    const { error } = await this.supabase
      .from('timers') 
      .upsert({ user_id: userId, time }, { onConflict: 'user_id' });
    if (error) throw error;
  }

  async loadTimerData(userId: string): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('timers')
      .select('time')
      .eq('user_id', userId)
      .single();
    if (error) {
      return null;  
    }
    return data ? data.time : null;
  }
}