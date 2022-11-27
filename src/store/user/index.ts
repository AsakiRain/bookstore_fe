import { defineStore } from 'pinia';
import type { LoginForm, RegisterForm } from '@/models/auth';
import { UserState } from './type';
import { Message } from '@arco-design/web-vue';
import type { PasswordForm, UserInfoForm } from '@/models/user';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: undefined,
    nickname: undefined,
    sex: undefined,
    created_at: undefined,
    updated_at: undefined
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    }
  },
  actions: {
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },
    async login(loginForm: LoginForm): Promise<boolean> {
      try {
        const resp = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginForm)
        });
        const payload = await resp.json();

        if (payload.code !== 20000) {
          Message.warning(payload.message);
          return false;
        }

        localStorage.setItem('token', payload.data.token);
        return true;
      } catch (err: any) {
        console.error(err);
        Message.error(err.message);
        return false;
      }
    },
    logout() {
      localStorage.removeItem('token');
    },
    async register(registerForm: RegisterForm): Promise<boolean> {
      try {
        const resp = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerForm)
        });
        const payload = await resp.json();
        if (payload.code !== 20000) {
          Message.warning(payload.message);
          return false;
        }
        localStorage.setItem('token', payload.data.token);
        return true;
      } catch (err: any) {
        console.error(err);
        Message.error(err.message);
        return false;
      }
    },
    async info(): Promise<boolean> {
      try {
        const resp = await fetch('/api/user/info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') || ''
          }
        });
        const payload = await resp.json();
        if (payload.code !== 20000) {
          Message.warning(payload.message);
          return false;
        }
        this.setInfo(payload.data.user_info);
        return true;
      } catch (err: any) {
        console.error(err);
        Message.error(err.message);
        return false;
      }
    },
    async update(userInfoForm: UserInfoForm): Promise<boolean> {
      try {
        const resp = await fetch('/api/user/info', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') || ''
          },
          body: JSON.stringify(userInfoForm)
        });
        const payload = await resp.json();
        if (payload.code !== 20000) {
          Message.warning(payload.message);
          return false;
        }
        return true;
      } catch (err: any) {
        console.error(err);
        Message.error(err.message);
        return false;
      }
    },
    async updatePassword(passwordForm: PasswordForm): Promise<boolean> {
      try {
        const resp = await fetch('/api/user/password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') || ''
          },
          body: JSON.stringify(passwordForm)
        });
        const payload = await resp.json();
        if (payload.code !== 20000) {
          Message.warning(payload.message);
          return false;
        }
        return true;
      } catch (err: any) {
        console.error(err);
        Message.error(err.message);
        return false;
      }
    }
  }
});
export default useUserStore;
