  <script>
  import { onBeforeMount, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import UserNameService from './services/userNameService';

  const userInfo = ref([]);

  export const goToIncidents = (router) => {
    router.push({ name: 'incidents' });
  };

  export const goToWarRooms = (router) => {
    router.push({ name: 'war_rooms' });
  };

  export const goToSupscriptions = (router) => {
    router.push({ name: 'subscripcions' });
  };

  export const section = ref('one');
  export const drawer = ref(false);

  export const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };

  export const get_user_info = () => {
    UserNameService.get_user_info()
      .then(response => {
        if (Array.isArray(response.data.data)) {
          userInfo.value = response.data.data;
        } else {
          userInfo.value = [response.data.data];
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

 export const formatName = (name) => {
    return name.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
  };

  export default {
    setup() {
      const router = useRouter();

      onBeforeMount(() => {
        get_user_info();
      })

      return {
        section,
        drawer,
        goToIncidents: () => goToIncidents(router),
        goToWarRooms: () => goToWarRooms(router),
        goToSupscriptions: () => goToSupscriptions(router),
        toggleDrawer,
        get_user_info,
        userInfo,
        formatName,
      };
    }
  };
</script>

  <template>
    <div class="q-pa-none">
      <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2">
        <q-header elevated class="bg-blue">
          <q-toolbar class="q-ml-md">
            <img src="@/assets/images/bbva-logo.svg" class="bbva-logo" />
            <q-space />
            <q-tabs v-model="section" align="right" class="gt-sm q-mr-md">
              <q-tab name="Incidencias" label="Incidencias" @click="goToIncidents()" />
              <q-tab name="suscripciones" label="suscripciones" @click="goToSupscriptions()" />
            </q-tabs>
            <div class="lt-md">
              <q-btn flat @click="toggleDrawer" round dense icon="sort" size="lg" />
            </div>
          </q-toolbar>
        </q-header>
        <q-drawer v-model="drawer" side="right" :width="250" :breakpoint="2000" class="custom-drawer">
          <q-scroll-area class="fit">
            <q-list padding class="menu-list">
              <div v-for="(nameInfo, index) in userInfo" :key="index">

                <div class=" row userName">
                  <div class="row col-3 avatarUser">
                    <q-icon name="account_circle" size="md" />
                  </div>
                  <div class="row col-9 name">
                    {{ formatName(nameInfo.name) }}
                  </div>
                </div>
                <div class="cssDescription">
                  {{ nameInfo.role }}
                </div>
              </div>
              <q-item class="sectionPestañas" clickable v-ripple @click="goToIncidents()">
                <q-item-section avatar>
                  <q-icon name="error" />
                </q-item-section>
                <q-item-section class="pestañas">
                  INCIDENCIAS
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToSupscriptions()">
                <q-item-section avatar>
                  <q-icon name="error" />
                </q-item-section>
                <q-item-section class="pestañas">
                  SUSCRIPCIONES
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-drawer>
        <q-page-container>
          <q-page class="q-pa-md row justify-center bg-grey">
            <div class="row justify-center col-12">
              <router-view></router-view>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;

  main {
    flex: 1;
    display: flex;
    place-items: initial;
  }
}
</style>

<style scoped lang="scss">
@import '@/assets/styles/utils.scss';

.bbva-logo {
  width: 85px;
  height: 26px;
  vertical-align: middle;
}

::v-deep .custom-drawer {
  background: #072146;
  color: white;
}

.userName {

  padding-top: 60px;
  

}

.sectionPestañas {
  margin-top: 20px;

}

.name {
  font-size: 17px;
  font-weight: 600;
  right: 6px;
}

.cssDescription {
  margin-left: 55px;
  font-size: 14px;


}

.avatarUser {
  padding-left: 13px;
}

.drawerIcon {
  float: right;

}

.pestañas {
  padding: 0px 0px 0px 0px;
}

.q-item__section--avatar {
  min-width: 0px;
}
</style>

